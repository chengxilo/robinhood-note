import {
    Alert,
    Button, Container, Snackbar,
    Stack, styled, Switch, ThemeProvider, Typography, useTheme,
} from "@mui/material";
import genTheme from "@/genTheme.js";
import {dataStoragePrefix} from "@/storage.ts";
import {storage, StorageItemKey} from "wxt/storage";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function App() {
    const [importAlert, setImportAlert] = useState({open: false,severity:'success',message:'default message'})

    const theme = genTheme('dark')
    return (<ThemeProvider theme={theme}>
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    direction: 'column',
                    justifyContent: 'center',
                    bgcolor: theme.palette.background.default,
                    width: '250px',
                    height: '280px',
                }}>
                <Stack
                    alignItems={'center'}
                    sx={{
                        width: '78%'
                    }}>
                    <Typography
                        color={'secondary'}
                        sx={{
                            fontSize: '20px',
                            marginBottom: '20px'
                        }}>
                        Robinhood Note
                    </Typography>
                    <Typography color={'primary'} sx={{
                        marginBottom: '14px',
                        fontWeight: 'bold'
                    }}>
                        Manage your note
                    </Typography>
                    <Button
                        component={'label'}
                        variant={'outlined'}
                        sx={{
                            fontSize: '12px',
                            marginBottom: '5px',
                            borderRadius: '44px',
                            textTransform: 'none',
                            width: '70%'
                        }}
                        color={'secondary'}>
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => {
                                const fileList = event.target.files
                                if (fileList === null) {
                                    console.log('No file selected')
                                    return
                                }
                                const file = fileList[0]

                                const reader = new FileReader()
                                reader.onload = async function (e) {
                                    if (e.target === null) {
                                        console.log('reader.onload, target is null')
                                        return
                                    }
                                    setImportAlert({open: true, severity: 'success', message: 'success, please refresh the page to see the changes!'})
                                    try {
                                        const data = JSON.parse(e.target.result as string)
                                        console.log(data)
                                        for (const key1 of Object.keys(data)
                                            .filter(key => key.startsWith(dataStoragePrefix))) {
                                            const note = data[key1]
                                            await storage.setItem(('local:' + key1) as StorageItemKey, note)
                                        }
                                    } catch (err) {
                                        console.log('Error: ', err)
                                        setImportAlert({open: true, severity: 'error', message: `fail, Are sure the file "${file.name}" is correct?`})
                                    }
                                }
                                reader.readAsText(file)
                            }}
                        />
                        Import Note
                    </Button>
                    <Snackbar open={importAlert.open} autoHideDuration={6000} onClose={() => {
                        setImportAlert({...importAlert,open: false})
                    }}>
                        <Alert
                            onClose={() => {
                                setImportAlert({...importAlert,open: false})
                            }}
                            severity={importAlert.severity}
                            variant={'filled'}
                            sx={{
                                width: '100%',
                                fontSize: '12px',
                                padding: '0 10px'
                            }}
                        >
                            {importAlert.message}
                        </Alert>
                    </Snackbar>
                    <Button
                        variant={'outlined'}
                        size={'small'}
                        sx={{
                            fontSize: '12px',
                            borderRadius: '44px',
                            textTransform: 'none',
                            width: '70%'
                        }}
                        color={'secondary'}
                        onClick={async () => {
                            const data = await storage.snapshot("local")

                            // delete all keys that are not note
                            Object.keys(data)
                                .filter(key => !key.startsWith(dataStoragePrefix))
                                .forEach(key => delete data[key])

                            // Convert data to JSON string for download
                            const jsonData = JSON.stringify(data);

                            // Create a Blob from the JSON data
                            const blob = new Blob([jsonData], {type: 'application/json'});

                            // Create a link element to trigger the download
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = 'data.json'; // Specify the filename
                            link.click(); // Trigger the download
                        }}>
                        Export Note
                    </Button>
                </Stack>
            </Container>
        </ThemeProvider>

    );
}

export default App;
