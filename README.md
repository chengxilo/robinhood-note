<div align="center">
    <h1>Robinhood Note</h1>
    <img style="width: 100px; border-radius: 15%" src="assets/robinhood note.png" alt="Robinhood Logo" />
    <p>A note-taking📗 extension for Robinhood
</p>
</div>

---

This is a web extension developed for Robinhood, based on the [WXT](https://wxt.dev/) + React + Material-UI

## 🎉 Features

- [x] Take note on Robinhood website
- [x] Export note to json file
- [x] Import note from json file
- [x] UI almost the same as Robinhood




## 🤺 Usage

### Option1: Install in chrome web store

[Download Robinhood Note](https://chromewebstore.google.com/detail/robinhood-note/pepimjpimedlkcalcikemegmfgbbolla)

### Option2: Compile Source Code 🛠️

1. Clone the repository:
    ```bash
    git clone https://github.com/chengxilo/robinhood-note.git
    ```

2. Install dependencies:
    ```bash
    pnpm install
    ```

3. Build the source code:
    ```bash
    pnpm run build
    ```
   
4. Open `chrome://extensions/` in your browser, enable `Developer mode`, click `Load unpacked`, 
and select the `.output/chrome-mv3` folder in the **project directory**.



## 🧩 Screenshots

You can find it on your home page. You can choose the stock by clicking the icon on the right side.

![img.png](img.png)

It will also show the note on the stock detail page.

![img_2.png](docs/img_2.png)

You can add/delete key-value pair and edit note content.

![img_1.png](docs/img_1.png)

Click extension icon to open the popup, you can import/export your note by clicking the button.

![img_1.png](docs/img_4.png)


## 🪁 Contributing

Pull requests are welcome. Feel free to...

- 📄 Revise documentation
- ✨ Add new features
- 🪲 Fix bugs
- 💡 Suggest improvements
