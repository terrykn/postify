import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CallsLeft from "../components/CallsLeft";
import { getApiResetTimeLeft } from "../utils/rateLimit";

function useApiResetCountdown() {
    const [timeLeft, setTimeLeft] = React.useState(getApiResetTimeLeft());

    React.useEffect(() => {
        function updateCountdown() {
            setTimeLeft(getApiResetTimeLeft());
        }
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    return timeLeft;
}

function formatMs(ms) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function LimitReached() {
    const navigate = useNavigate();
    const timeLeft = useApiResetCountdown();

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" sx={{ color: "#fff", mb: 2, fontFamily: "Spotify Mix", fontWeight: 800 }}>
                    Limit Reached ☹️
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc", mb: 3, fontFamily: "Spotify Mix, Arial, sans-serif" }}>
                    Sorry, you have reached the usage limit.<br />
                    Please try again later - {formatMs(timeLeft)}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        fontFamily: 'Spotify Mix',
                        textTransform: 'none',
                        boxShadow: 0,
                        borderRadius: 8,
                        backgroundColor: 'rgba(88, 88, 88, 0.7)',
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' },
                        fontSize: 16
                    }}
                    onClick={() => navigate("/")}
                >
                    Back to Homepage
                </Button>
            </Box>
        </Container>
    );
}

export default LimitReached;