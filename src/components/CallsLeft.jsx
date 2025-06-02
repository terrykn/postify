import React from "react";
import { getApiCallsLeft, getApiResetTimeLeft } from "../utils/rateLimit";
import { Box, Container } from "@mui/material";

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

const CallsLeft = () => {
    const callsLeft = getApiCallsLeft();
    const timeLeft = useApiResetCountdown();

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', p: 2, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
            <Box sx={{ backgroundColor: '#1a1a1a', pt: 1.5, pb: 1.5, pl: 2, pr: 2, borderRadius: 5 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {callsLeft} credits remaining
                </span>
                {callsLeft < 20 && (
                    <span style={{ ml: 4, fontWeight: 600, fontSize: 14 }}>
                        {` (resets in: ${formatMs(timeLeft)})`}
                    </span>
                )}
            </Box>
        </Container>
    );
};

export default CallsLeft;