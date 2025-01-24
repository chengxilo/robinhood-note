import {
    Button, Container,
    Stack, Switch, ThemeProvider, Typography, useTheme,
} from "@mui/material";
import genTheme from "@/genTheme.js";

function App() {
    const theme = genTheme('dark')
    return (<ThemeProvider theme={theme}>
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    direction: 'column',
                    justifyContent: 'center',
                    bgcolor: theme.palette.background.default,
                    width: '300px',
                    height: '200px',
                }}>
                <Stack sx={{
                    width: '70%'
                }}>
                    <Typography
                        color={'secondary'}
                        sx={{
                            marginBottom: '20px'
                        }}>
                        Robinhood Note
                    </Typography>
                    <Typography color={'primary'} sx={{
                        marginBottom: '10px'
                    }}>
                        Download your note with a click!
                    </Typography>
                    <Button
                        variant={'contained'}
                        size={'small'}
                        sx={{
                            fontSize: '12px',
                        }}
                        color={'secondary'}
                        onClick={async () => {
                            const data = await storage.snapshot("local")

                            console.log(data)
                            // Convert data to JSON string for download
                            const jsonData = JSON.stringify(data);

                            // Create a Blob from the JSON data
                            const blob = new Blob([jsonData], {type: 'application/json'});

                            // Create a link element to trigger the download
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = 'data.json'; // Specify the filename
                            link.click(); // Trigger the download
                        }}>
                        Download Note
                    </Button>
                </Stack>
            </Container>
        </ThemeProvider>

    );
}

export default App;
