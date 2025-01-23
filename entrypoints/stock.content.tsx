import ReactDOM from 'react-dom/client';
import NoteBar from "@/component/noteBar.tsx";
import {ReactNode} from "react";
import ThemePack from "@/entrypoints/themepack.tsx";
import {Typography} from "@mui/material";


export default defineContentScript({
    matches: ['https://robinhood.com/*'],
    async main(ctx) {
        const container = document.createElement("div");
        container.style.width = "calc(100% - 24px)";
        container.style.marginLeft = "12px"
        container.style.marginRight = "12px"
        container.style.marginBottom = "20px";
        const root = ReactDOM.createRoot(container);
        root.render(<>
            <ThemePack component={<NoteBar/>}/>
        </> as ReactNode);

        const targetSelector = '#react_root > main > div:nth-child(2) > div > div > div > div > main > div > div > div > section:nth-child(4)';

        const observer = new MutationObserver((mutationsList, observer) => {
            const target = document.querySelector(targetSelector);
            if (target) {
                target.insertAdjacentElement('afterend', container);
                observer.disconnect(); // Stop observing once the target is found and the element is inserted
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    },
});