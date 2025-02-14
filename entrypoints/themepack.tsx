import {ThemeProvider} from "@mui/material";
import genTheme from "@/genTheme.js";

const ThemePack = ({component}) => {
    // read theme from local storage
    const theme = localStorage.getItem('web-app:theme-setting')
    // console.log("get theme from local storage", theme)
    return <ThemeProvider theme={genTheme(theme)}>
        {component}
    </ThemeProvider>
}
export default ThemePack;