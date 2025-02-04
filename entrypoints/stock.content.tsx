import ReactDOM from 'react-dom/client';
import {StockPageNoteBar} from "@/component/noteBar.tsx";
import {ReactNode} from "react";
import ThemePack from "@/entrypoints/themepack.tsx";
import createCache from "@emotion/cache";
import {CacheProvider} from "@emotion/react";

export default defineContentScript({
    matches: ['https://robinhood.com/*'],
    async main(ctx) {
        const container = document.createElement("div");
        container.style.width = "calc(100% - 24px)";
        container.style.marginLeft = "12px"
        container.style.marginRight = "12px"
        container.style.marginBottom = "48px";
        container.id = "note";
        const shadowContainer = container.attachShadow({mode: 'open'});
        const shadowRootElement = document.createElement('div');
        shadowContainer.appendChild(shadowRootElement)
        const cache = createCache({
            key: 'note-bar',
            container: shadowContainer,
            prepend: true
        })
        const root = ReactDOM.createRoot(shadowRootElement);

        const observer = new MutationObserver((mutationsList, observer) => {
            // console.log('try observe')
            // find the buy tab as there is the stock symbol
            const buyTabOfBuyAndSell = document.querySelector('#sdp-ticker-symbol-highlight > div > form > div > div > div > div > div > div > div > div > div > div > h3 > span > span')
            const onlyBuyTab = document.querySelector('#sdp-ticker-symbol-highlight > div > form > div > div > div > div > div > div > div > span')
            let content: string | null;
            if (buyTabOfBuyAndSell) {
                content = buyTabOfBuyAndSell.textContent
            } else if (onlyBuyTab) {
                content = onlyBuyTab.textContent
            } else {
                // console.log('can not find tab for symbol')
                return;
            }
            if (content === null) return;
            const symbol = content.split(' ')[1]
            const target = document.querySelector('#etf-about-header');
            // console.log(symbol)
            if (target) {
                // console.log('insert note bar')
                root.render(
                    <CacheProvider value={cache}>
                        <ThemePack component={<StockPageNoteBar stock={symbol}/>}/>
                    </CacheProvider> as ReactNode);
                if (target.previousElementSibling && target.previousElementSibling.id === "note") return;
                target.insertAdjacentElement('beforebegin', container);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    },
});