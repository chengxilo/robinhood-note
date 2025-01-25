import ReactDOM from 'react-dom/client';
import {StockPageNoteBar} from "@/component/noteBar.tsx";
import {ReactNode} from "react";
import ThemePack from "@/entrypoints/themepack.tsx";

export default defineContentScript({
    matches: ['https://robinhood.com/stocks/*'],
    async main(ctx) {
        const container = document.createElement("div");
        container.style.width = "calc(100% - 24px)";
        container.style.marginLeft = "12px"
        container.style.marginRight = "12px"
        container.style.marginBottom = "48px";
        container.id = "note";
        const root = ReactDOM.createRoot(container);

        const observer = new MutationObserver((mutationsList, observer) => {
            console.log('try observe')
            // find the buy tab as there is the stock symbol
            const buyTabOfBuyAndSell = document.querySelector('#sdp-ticker-symbol-highlight > div > form > div > div > div > div > div > div > div > div > div > div > h3 > span > span')
            const onlyBuyTab = document.querySelector('#sdp-ticker-symbol-highlight > div > form > div > div > div > div > div > div > div > span')
            let content: string | null;
            if (buyTabOfBuyAndSell) {
                content = buyTabOfBuyAndSell.textContent
            } else if (onlyBuyTab) {
                content = onlyBuyTab.textContent
            } else {
                console.log('can not find tab for symbol')
                return;
            }
            if (content === null) return;
            const symbol = content.split(' ')[1]
            const target = document.querySelector('#etf-about-header');
            console.log(target)
            if (target) {
                console.log('find target out', target.previousElementSibling?.id)
                if (target.previousElementSibling && target.previousElementSibling.id === "note") return;
                root.render(<>
                    <ThemePack component={<StockPageNoteBar stock={symbol}/>}/>
                </> as ReactNode);
                target.insertAdjacentElement('beforebegin', container);
                observer.disconnect(); // Stop observing once the target is found and the element is inserted
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    },
});