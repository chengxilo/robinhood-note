import './App.css';
import {Button, ThemeProvider, createTheme, Switch, Typography, Stack, TextField, IconButton} from "@mui/material";
import {Setting} from "@/component/setting.tsx";
import NoteBar from "@/component/noteBar.tsx";
import theme from '@/theme.js'
import switchableTheme from "@/theme.js";
import useModal from "@mui/material/Modal/useModal";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <>
            <ThemeProvider theme={theme}>
                <Setting/>
            </ThemeProvider>
        </>
    );
}

export default App;
