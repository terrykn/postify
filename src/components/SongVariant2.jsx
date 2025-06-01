import React from "react";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, Container, Typography, Slider } from "@mui/material";

const SongVariant2 = React.forwardRef(function SongVariant2(
    { songData, backgroundColor, textColor, selectedTimestamp },
    ref
) {
    const durationSec = songData?.duration_ms ? Math.floor(songData.duration_ms / 1000) : 0;
    const formatTime = (sec) => {
        const min = Math.floor(sec / 60);
        const s = String(sec % 60).padStart(2, '0');
        return `${min}:${s}`;
    };

    const iconColor = (backgroundColor || "#232323").replace('#', '').toUpperCase();
    return (
        <Container
            ref={ref}
            disableGutters
            style={{
                backgroundColor,
                color: textColor,
                width: 1080,
                height: 'auto',
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                padding: 100,
                gap: 30,
                position: "relative",
            }}
        >

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'left', width: '100%', mb: 4 }}>
                <img src={songData.album?.images?.[0]?.url}
                    alt={songData.name}
                    style={{ width: '100%', height: 'auto', borderRadius: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ fontFamily: 'Spotify Mix', fontSize: 60, fontWeight: 600, color: '#fff' }}>
                        {songData.name}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Spotify Mix', fontSize: 36, fontWeight: 500, color: '#F3F3F3' }}>
                        {songData.artists?.map((a) => a.name).join(", ")}
                    </Typography>
                </Box>
                <Box>
                    <FavoriteRoundedIcon sx={{ fontSize: 56, color: 'white' }} />
                </Box>
            </Box>

            <Box sx={{ mt: 4, mb: 4 }}>
                <Slider
                    value={selectedTimestamp}
                    min={0}
                    max={durationSec}
                    step={1}
                    disabled
                    sx={{
                        color: '#fff',
                        '& .MuiSlider-rail': {
                            color: '#F3F3F3',
                            opacity: 1,
                        },
                        '& .MuiSlider-track': {
                            color: '#fff',
                        },
                        '& .MuiSlider-thumb': {
                            color: '#fff',

                        },
                    }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 1 }}>
                    <Typography sx={{ fontFamily: 'Spotify Mix', fontSize: 28, fontWeight: 500, color: '#F3F3F3' }}>
                        {formatTime(selectedTimestamp)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Spotify Mix', fontSize: 28, fontWeight: 500, color: '#F3F3F3' }}>
                        {formatTime(durationSec)}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <img src={'https://img.icons8.com/?size=80&id=91479&format=png&color=F3F3F3'} alt="prev" />
                <img src={'https://img.icons8.com/?size=80&id=kXxOhHbYAXYl&format=png&color=FFFFFF'} alt="rewind" />
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 4, mr: 4 }}>
                    {/* Large white circle as play button background */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 170,
                            height: 170,
                            borderRadius: '50%',
                            background: '#fff',
                            zIndex: 1,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <polygon points="12,8 32,20 12,32" fill={backgroundColor} />
                        </svg>
                    </Box>
                    <img
                        key={iconColor}
                        src={`https://img.icons8.com/?size=80&id=9978&format=png&color=${iconColor}`}
                        alt="play"
                        style={{ position: 'relative', zIndex: 2 }}
                    />
                </Box>
                <img src={'https://img.icons8.com/?size=80&id=4n9XxaO80mrS&format=png&color=FFFFFF'} alt="forward" />
                <img src={'https://img.icons8.com/?size=80&id=91481&format=png&color=F3F3F3'} alt="next" />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <img src={'https://img.icons8.com/?size=70&id=85944&format=png&color=F3F3F3'} />
                <img src={'https://img.icons8.com/?size=70&id=113920&format=png&color=F3F3F3'} />
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "35%",
                    pointerEvents: "none",
                    background: "linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0))",
                    zIndex: 2,
                }}
            />
        </Container>
    )
})

export default SongVariant2;