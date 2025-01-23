import {Card, CardContent, Fade, Stack, Switch, Typography} from "@mui/material";

export function Setting() {
    const [show, setShow] = useState(false)
    addEventListener("mouseenter",() => {

    })
    return <Fade in={show}>
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Word of the Day
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    adjective
                </Typography>
                <Typography variant="body2">
                    well meaning and kindly.
                    <br/>
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
        </Card>
    </Fade>
}

