import './App.css';
import {ThemeProvider} from "@mui/material";
import {Setting} from "@/component/setting.tsx";
import theme from '@/theme.js'

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
