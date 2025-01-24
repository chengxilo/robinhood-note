import {createTheme} from "@mui/material";

const genTheme = function (mode) {
    return createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: mode === 'dark' ? '#ffffff' : '#000000'
            },
            secondary: {
                main: '#00c805'
            },
            background: {
                default: mode === 'dark' ? '#1c1c1c' : '#adadad'
            }
        }
    })
}
export default genTheme;