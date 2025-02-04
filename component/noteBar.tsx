import {IconButton, Stack, styled, TextField, Typography} from "@mui/material";
import {ReactNode, useEffect} from "react";
import Grid from '@mui/material/Grid2';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {storage} from "wxt/storage";
import {getDataStorageKey, getSymbolStorageKey} from "@/storage.ts";

class KVElement {
    id: number;
    key: string;
    val: string;

    constructor(id: number, key: string, val: string) {
        this.id = id;
        this.key = key;
        this.val = val;
    }

    empty() {
        return this.key === "" && this.val === ""
    }
}

class DataInStorage {
    note: string
    kv: { key: string, val: string }[]

    constructor(note, kv) {
        this.note = note;
        this.kv = kv;
    }
}

class Data {
    id: number;
    note: string;
    kv: Map<number, KVElement>;

    constructor(note: string, kkv: { key: string, val: string }[]) {
        this.note = note;
        this.kv = new Map<number, KVElement>(
            kkv.map((v, idx) =>
                [idx, new KVElement(idx, v.key, v.val)]));
        // if the kv is empty, add an empty kv so there is always a kv for user to edit
        if (this.kv.size === 0) {
            this.kv.set(0, new KVElement(0, "", ""))
        }
        this.id = this.kv.size;
    }

    // covert the plain object to Data object
    static fromStorageObject(obj: any) {
        return new Data(obj.note, obj.kv)
    }

    toStorageObject(): DataInStorage {
        return {
            note: this.note,
            kv: Array.from(this.kv.values()).map((v) => ({
                key: v.key,
                val: v.val
            }))
        }
    }

    empty() {
        if (this.kv.size === 0) {
            console.log("warning: data.kv.size should not be 0!")
            return true
        }
        return this.note === "" && this.kv.size === 1 && [...this.kv.values()][0].empty()
    }

    addEmptyKV() {
        this.kv.set(this.id, new KVElement(this.id, "", ""))
        this.id++;
    }

    cleanEmpty() {
        for (const [key, value] of this.kv) {
            if (value.empty()) {
                this.kv.delete(key);
            }
        }
        if (this.kv.size === 0) {
            this.addEmptyKV();
        }
    }

    // deep clone the object
    clone() {
        return new Data(this.note,
            Array.from(this.kv.values()).map((v) => ({
                key: v.key,
                val: v.val
            })))
    }
}

const HomePageNoteBar = () => {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState(new Data("This is where a masterpiece in every sense of the word is created!", [
        {key: "key1", val: "value1"},
        {key: "key2", val: "value2"},
        {key: "key3", val: "value3"},
    ]));
    useEffect(() => {
        // if they symbol in storage is not empty, load the symbol in storage
        storage.getItem(getSymbolStorageKey()).then((symbolVal) => {
            if (symbolVal === null) {
                console.log('symbol in storage is null')
                return
            }
            // set symbol
            setSymbol(symbolVal as string)
        })

        // watch the symbol change
        // when the symbol change, we need to load the data from storage
        storage.watch(getSymbolStorageKey(), async (newValue) => {
            console.log("symbol change to", newValue)
            setSymbol(newValue as string)
            // load the data from storage
            const dd =
                await storage.getItem<object>(getDataStorageKey(newValue as string)) ?? new DataInStorage("", [{
                    key: "",
                    val: ""
                }])
            setData(Data.fromStorageObject(dd))
        })
    }, [])
    // when the symbol change, we need to load the data from storage
    useEffect(() => {
        // load the data from storage
        storage.getItem(getDataStorageKey(symbol as string)).then((value) => {
            console.log("load data from storage", value)
            setData(Data.fromStorageObject(value as DataInStorage ?? new DataInStorage("", [{key: "", val: ""}])))
        })
    }, [symbol]);
    return <NoteBar symbol={symbol} setData={setData} data={data}/>
}

const StockPageNoteBar = ({stock}) => {
    const [data,setData] = useState(new Data("",[]))
    useEffect(() => {
        // load the data from storage
        storage.getItem(getDataStorageKey(stock)).then((value) => {
            setData(Data.fromStorageObject(value as DataInStorage ?? new DataInStorage("", [{key: "", val: ""}])))
        })
        // watch the storage change of stock
        storage.watch(getDataStorageKey(stock), async (newValue) => {
            setData(Data.fromStorageObject(newValue as DataInStorage ?? new DataInStorage("", [{key: "", val: ""}])))
        })
    }, []);

    return <NoteBar symbol={stock} setData={setData} data={data}/>
}

function NoteBar({symbol, data, setData}) {
    const [tmp, setTmp] = useState(data.clone());
    const [editMode, setEditMode] = useState(false);
    // make sure that the data and tmp is the same when data is changed,for example, when the data is loaded
    // from storage because we want to show the data for a new stock
    useEffect(() => {
        setTmp(data.clone())
    }, [data])

    const addKV = () => {
        let newTmp = tmp.clone();
        newTmp.addEmptyKV();
        setTmp(newTmp)
    }

    const removeKV = (id: number) => {
        let newTmp = tmp.clone();
        newTmp.kv.delete(id);
        setTmp(newTmp)
    }

    const saveData = () => {
        // remove empty kv
        const newTmp = new Data(
            tmp.note,
            Array.from(tmp.kv.values()).map((v) => ({
                key: v.key,
                val: v.val
            })))

        // clean the empty kv before saving
        newTmp.cleanEmpty();

        // save the data
        setData(new Data(
            newTmp.note,
            Array.from(newTmp.kv.values()).map((v) => ({
                key: v.key,
                val: v.val
            }))))

        // change to view mode
        setEditMode(false)

        // save the data to storage
        storage.setItem<object>(getDataStorageKey(symbol), newTmp.toStorageObject())
    }

    const discardChanges = () => {
        setEditMode(false)
        // discard the change
        setTmp(data.clone())
    }

    return <Stack>
        <Stack direction={"row"} sx={{
            paddingBottom: "6px",
            borderBottom: "1px solid rgb(48, 54, 58)",
            justifyContent: "space-between"
        }}>
            <Typography fontSize="24px">
                {symbol} Note
            </Typography>
            {(editMode ?
                <Stack direction={"row"}>
                    <IconButton color={"primary"} onClick={addKV}>
                        <AddIcon/>
                    </IconButton>
                    <IconButton color={"primary"} onClick={saveData}>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton color={"primary"} onClick={discardChanges}>
                        <CloseIcon/>
                    </IconButton>
                </Stack>
                :
                <IconButton color={"primary"} onClick={() => setEditMode(true)}>
                    <EditNoteIcon/>
                </IconButton>) as ReactNode}
        </Stack>

        <Grid container spacing={0} sx={{
            marginTop: "10px",
        }}>
            {Array.from(tmp.kv).map(([mapKey, kvElement] : [number, KVElement]) => (
                <Grid key={mapKey} spacing={2} size={3} sx={{
                    marginTop: "12px",
                }}>
                    {(editMode ? <Stack direction={"column"} spacing={0}>
                            <Stack direction={"row"}>
                                <StyledTextField
                                    size={"small"}
                                    slotProps={{input: {sx: {fontWeight: "bold"}}}}
                                    value={tmp.kv.get(mapKey)?.key ?? ""}
                                    onKeyDown={(e) => {
                                        e.stopPropagation()
                                    }}
                                    onChange={(e) => {
                                        let newTmp = tmp.clone();
                                        newTmp.kv.set(mapKey, new KVElement(
                                            mapKey,
                                            e.target.value,
                                            tmp.kv.get(mapKey)?.val ?? ""))
                                        setTmp(newTmp)
                                    }}
                                    sx={{
                                        background: "none",
                                        width: "80%",
                                    }}/>
                                <IconButton color={"primary"} size={"small"}>
                                    <RemoveCircleOutlineIcon onClick={() => removeKV(mapKey)}/>
                                </IconButton>
                            </Stack>
                            <StyledTextField
                                size={"small"}
                                value={tmp.kv.get(mapKey)?.val ?? ""}
                                onKeyDown={(e) => {
                                    e.stopPropagation()
                                }}
                                onChange={(e) => {
                                    let newTmp = tmp.clone();
                                    newTmp.kv.set(mapKey, new KVElement(
                                        mapKey,
                                        tmp.kv.get(mapKey)?.key ?? "",
                                        e.target.value
                                    ))
                                    setTmp(newTmp)
                                }}
                                sx={{
                                    width: "80%",
                                }}/>
                        </Stack>
                        :
                        <Stack direction={"column"} spacing={0}>
                            <Typography fontSize={"13px"} sx={{
                                fontWeight: "bold"
                            }}>{kvElement.key}</Typography>
                            <Typography fontSize={"13px"}>{kvElement.val}</Typography>
                        </Stack>) as ReactNode}
                </Grid>
            )) as ReactNode}
        </Grid>
        <Grid container size={12} sx={{
            marginTop: "20px"
        }}>
            <Stack direction={"column"} sx={{
                width: "100%"
            }}>
                {(editMode ?
                    <StyledTextField
                        sx={{width: "100%",}}
                        onKeyDown={(e) => {
                            e.stopPropagation()
                        }}
                        onChange={(e) => {
                            let newTmp = tmp.clone();
                            newTmp.note = e.target.value;
                            setTmp(newTmp)
                        }}
                        multiline={true}
                        value={tmp.note}/> :
                    <Typography fontSize={"13px"}>
                        {data.note}
                    </Typography>) as ReactNode}
            </Stack>
        </Grid>
    </Stack>
}

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#30363a', // Default border color
        },
    },
    '& .MuiInputBase-input': {
        fontSize: "13px",
    }
});

export {HomePageNoteBar,StockPageNoteBar}