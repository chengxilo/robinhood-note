import ReactDOM from "react-dom/client";
import {ReactNode} from "react";
import {ContentScriptContext} from "wxt/dist/client";
import {IconButton, ThemeProvider, Typography} from "@mui/material";
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import NoteBar from "@/component/noteBar.tsx";
import theme from "@/theme.js";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";
import {getSymbolStorageKey} from "@/storage.ts";
import ThemePack from "@/entrypoints/themepack.tsx";


export default defineContentScript({
        matches: ['https://robinhood.com/'],
        async main(ctx: ContentScriptContext) {
            const ui = await createShadowRootUi(ctx, {
                name: "note-bar",
                position: "inline",
                anchor: "#react_root > main > div > div > div > div > div > div > div > div > main > div.css-1d3w5wq",
                append: "after",
                onMount: (container) => {
                    const root = ReactDOM.createRoot(container);
                    const cache = createCache({
                        key: 'note-bar',
                        container: container,
                        prepend: true,
                    })

                    console.log(theme)
                    const Component = () => {
                        return <CacheProvider value={cache}>
                            <ThemePack component={<NoteBar/>}/>
                        </CacheProvider>
                    }
                    root.render(<Component/> as ReactNode);
                    return root;
                },
                onRemove: (mounted) => {
                    mounted?.unmount();
                }
            });

            // Call autoMount to observe anchor element for add/remove.
            ui.autoMount();

            new Promise(() => {
                    const observer = new MutationObserver((mutationsList, observer) => {
                        const list = document.querySelectorAll("#react_root > main > div > div > div > div > div > div > div > div > aside > div > div > div > div > div > div > div");
                        if (list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].getAttribute("data-testid") !== "PositionCell" && list[i].getAttribute("data-testid") !== "") continue
                                const ele = list[i].querySelectorAll("a > div")[2];
                                if (ele) {
                                    // Insert button.css if not already added
                                    if (!ele.nextElementSibling || ele.nextElementSibling.tagName !== "DIV") {
                                        const container = document.createElement("div");
                                        const root = ReactDOM.createRoot(container);

                                        const symbol = list[i].querySelectorAll("a > div > div")[0].textContent
                                        const iconBtn = <ThemePack component={
                                            <IconButton size={"small"}
                                                        color={"primary"}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            storage.setItem(getSymbolStorageKey(), symbol)
                                                        }}
                                                        sx={{
                                                            marginLeft: "3px"
                                                        }}>
                                                <ArticleOutlinedIcon size={"medium"}/>
                                            </IconButton>}/>
                                        root.render(iconBtn as ReactNode);

                                        ele.insertAdjacentElement("afterend", container);

                                    }
                                }
                            }
                        }
                    });
                    observer.observe(document.body, {childList: true, subtree: true});
                }
            )
        }
        ,
    }
)
;
