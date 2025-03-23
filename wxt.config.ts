import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Robinhood Note',
    description: "A note extension for Robinhood. You can take notes on the Robinhood website with it",
    permissions: ['storage'],
    version: '0.0.2'
  }
});
