import {StorageItemKey} from "wxt/storage";

const getDataStorageKey = (symbol: string) => `local://robin-tag/note/${symbol}` as StorageItemKey;
const getSymbolStorageKey = () => `local://robin-tag/symbol` as StorageItemKey;


export {getDataStorageKey, getSymbolStorageKey};