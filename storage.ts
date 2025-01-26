import {StorageItemKey} from "wxt/storage";


const dataStoragePrefix = 'robinhood-note/note/';
const getDataStorageKey = (symbol: string) => `local:${dataStoragePrefix}${symbol}` as StorageItemKey;
const getSymbolStorageKey = () => `local:robinhood-note/symbol` as StorageItemKey;


export {getDataStorageKey, getSymbolStorageKey,dataStoragePrefix};