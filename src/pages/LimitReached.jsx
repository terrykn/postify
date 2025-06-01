import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LimitReached() {
    const navigate = useNavigate();

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
                    Please try again later.
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