import {createTheme} from "@mui/material";

const theme = function (mode) {
    return createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: mode === 'dark' ? '#ffffff' : '#000000'
            }
        }
    })
}
export default theme;