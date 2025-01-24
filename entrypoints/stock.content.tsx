import ReactDOM from 'react-dom/client';
import {StockPageNoteBar} from "@/component/noteBar.tsx";
import {ReactNode} from "react";
import ThemePack from "@/entrypoints/themepack.tsx";

export default defineContentScript({
    matches: ['https://robinhood.com/*'],
    async main(ctx) {
        const container = document.createElement("div");
        container.style.width = "calc(100% - 24px)";
        container.style.marginLeft = "12px"
        container.style.marginRight = "12px"
        container.style.marginBottom = "48px";
        const root = ReactDOM.createRoot(container);

        const observer = new MutationObserver((mutationsList, observer) => {
            // find the buy tab as there is the stock symbol
            const buyTab = document.querySelector('#sdp-ticker-symbol-highlight > div  > form > div > div > div > div > div > div > div > div > div > div  > h3 > span')
            if (buyTab === null) return;
            const content = buyTab.textContent
            if (content === null) return;
            const symbol = content.split(' ')[1]
            const target = document.querySelector('#react_root > main > div:nth-child(2) > div > div > div > div > main > div > div > div > section:nth-child(4)');
            if (target) {
                root.render(<>
                    <ThemePack component={<StockPageNoteBar stock={symbol}/>}/>
                </> as ReactNode);
                target.insertAdjacentElement('afterend', container);
                observer.disconnect(); // Stop observing once the target is found and the element is inserted
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    },
});