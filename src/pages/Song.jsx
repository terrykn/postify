import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useRef } from "react";
import * as htmlToImage from "html-to-image";

import Drawer from '@mui/material/Drawer';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Slider from '@mui/material/Slider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import SongVariant1 from "../components/SongVariant1";
import SongVariant2 from "../components/SongVariant2";

import { canMakeApiCall } from "../utils/rateLimit";
import { canMakeApiCallWithThrottle } from "../utils/rateLimit";
import CallsLeft from "../components/CallsLeft";

function Song() {
    const location = useLocation();
    const link = location.state?.link || '';

    // remove ?si= and anything after it before extracting the songId
    const cleanLink = link.includes('?si=') ? link.split('?si=')[0] : link;
    const songId = cleanLink.split('/').pop();

    const navigate = useNavigate();

    if (link === '') {
        navigate('/');
    }

    const url = process.env.REACT_APP_RAPIDAPI_SPOTIFY_URL + '/tracks/?ids=' + songId;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_SPOTIFY_KEY,
            'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_SPOTIFY_HOST
        }
    };

    function getCache(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            const { data, expiry } = JSON.parse(item);
            if (expiry && Date.now() > expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return data;
        } catch {
            return null;
        }
    }
    function setCache(key, data, ttlMs = 1000 * 60 * 60 * 24 * 7) {
        const expiry = Date.now() + ttlMs;
        localStorage.setItem(key, JSON.stringify({ data, expiry }));
    }

    const [songData, setSongData] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#232323');
    const [variant, setVariant] = useState('variant1');
    const [reinputOpen, setReinputOpen] = useState(false);
    const [newLink, setNewLink] = useState('');

    const [slowDownOpen, setSlowDownOpen] = useState(false);

    useEffect(() => {
        if (songData != null) return;

        const cacheKey = `songdata_${songId}`;
        const cached = getCache(cacheKey);
        if (cached) {
            setSongData(cached);
            return;
        }

        if (!canMakeApiCall()) {
            navigate('/limit-reached');
            return;
        }
        if (!canMakeApiCallWithThrottle(() => setSlowDownOpen(true))) {
            return;
        }
        console.log('[API CALL] fetching song data for songId:', songId);
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                setSongData(response.tracks[0]);
                setCache(cacheKey, response.tracks[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [url, options, songId]);

    const [lyrics, setLyrics] = useState([]);
    const [numLines, setNumLines] = useState(1);
    const [selectedLines, setSelectedLines] = useState([]);
    const [customLyrics, setCustomLyrics] = useState([""]);
    const [usingCustomLyrics, setUsingCustomLyrics] = useState(false);
    const [selectedTimestamp, setSelectedTimestamp] = useState(0);

    const songDurationSec = songData?.duration_ms ? Math.floor(songData.duration_ms / 1000) : 0;

    useEffect(() => {
        if (songData && lyrics.length === 0) {
            const lyricsUrl = process.env.REACT_APP_RAPIDAPI_SPOTIFY_URL + '/track_lyrics/?id=' + songId;
            const lyricsCacheKey = `lyrics_${songId}`;
            const cachedLyrics = getCache(lyricsCacheKey);
            if (cachedLyrics) {
                setLyrics(cachedLyrics);
                return;
            }
            const lyricsOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_SPOTIFY_KEY,
                    'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_SPOTIFY_HOST
                }
            };
            if (!canMakeApiCall()) {
                navigate('/limit-reached');
                return;
            }

            console.log('[API CALL] fetching lyrics for songId:', songId);
            fetch(lyricsUrl, lyricsOptions)
                .then(response => response.json())
                .then(response => {
                    if (response.lyrics && Array.isArray(response.lyrics.lines)) {
                        setLyrics(response.lyrics.lines);
                        setCache(lyricsCacheKey, response.lyrics.lines);
                    } else {
                        setLyrics([{ words: "Not found" }]);
                        setCache(lyricsCacheKey, [{ words: "Not found" }]);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setLyrics([{ words: 'Not found' }])
                });
        }
    }, [songData, songId, lyrics]);

    useEffect(() => {
        if (selectedLines.length > 0 && lyrics.length > 1) {
            const startIndex = lyrics.findIndex(l => l === selectedLines[0]);
            if (startIndex !== -1) {
                setSelectedLines(lyrics.slice(startIndex, startIndex + numLines));
            }
        }
    }, [numLines, lyrics]);

    const variantRef = useRef(null);

    const handleDownload = () => {
        if (variantRef.current) {
            htmlToImage.toPng(variantRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'song.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error) => {
                    console.error('Error downloading image:', error);
                });
        }
    };

    const exportSize = { width: 1080, height: 1080 };

    const textColor = getContrastingColor(backgroundColor || "#232323");
    const bgHex = backgroundColor.replace('#', '');
    const textHex = isColorLight(bgHex) ? 'black' : 'white';
    const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/${bgHex}/${textHex}/640/spotify:song:${songId}`;

    const handleReinput = () => {
        setReinputOpen(true);
        setNewLink('');
    };

    const handleReinputClose = (submit) => {
        setReinputOpen(false);
        if (submit && newLink) {
            navigate('/song', { state: { link: newLink } });
            window.location.reload();
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            <Dialog open={slowDownOpen} onClose={() => setSlowDownOpen(false)}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Please slow down!
                    </Typography>
                    <Typography variant="body2">
                        You can only make one request every 5 seconds.
                    </Typography>
                    <Button onClick={() => setSlowDownOpen(false)} sx={{ mt: 2 }}>
                        OK
                    </Button>
                </Box>
            </Dialog>
            {/* Sidebar Drawer */}
            <Drawer
                variant="permanent"
                anchor={isMobile ? "bottom" : "left"}
                slotProps={{
                    paper: {
                        sx: isMobile
                            ? {
                                width: '100vw',
                                height: 340,
                                maxHeight: '60vh',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                top: 'auto',
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                borderRight: 0,
                                borderBottom: 0,
                                borderLeft: 0,
                                boxSizing: 'border-box',
                                p: 2,
                                position: 'fixed',
                            }
                            : {
                                width: 260,
                                boxSizing: 'border-box',
                                p: 2,
                            }
                    }
                }}
                open
                sx={{
                    flexShrink: 0,
                    zIndex: isMobile ? theme.zIndex.modal + 1 : undefined,
                }}
            >
                <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => navigate('/')} size="small" sx={{ color: 'white', ml: -1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body">
                            Change Color
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        background: backgroundColor,
                                        boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
                                        border: '2px solid #fff',
                                    }}
                                />
                                <input
                                    type="color"
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    value={backgroundColor}
                                    style={{
                                        opacity: 0,
                                        width: 36,
                                        height: 36,
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        cursor: 'pointer',
                                        border: 'none',
                                        padding: 0,
                                        margin: 0,
                                    }}
                                    tabIndex={-1}
                                />
                            </label>
                        </div>
                    </Box>
                    {/* Variant selection */}
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body">
                            Layout
                        </Typography>
                        <select
                            value={variant}
                            onChange={e => setVariant(e.target.value)}
                            style={{
                                borderRadius: 5,
                                border: '1px solid #ccc',
                                fontSize: 16,
                                fontFamily: 'inherit',
                                background: '#fafafa',
                                color: '#232323',
                                cursor: 'pointer',
                                padding: 3
                            }}
                        >
                            <option value="variant1">Lyrics</option>
                            <option value="variant2">"Now Playing"</option>
                        </select>
                    </Box>

                    {/* Sidebar based on variant */}
                    {variant === "variant1" ? (
                        <>
                            {/* Lyric Selection */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body">
                                    Click to Choose Lyrics
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto', height: '30vh' }}>
                                {lyrics.length > 1 ? (
                                    lyrics.map((line, index) => {
                                        const startIndex = selectedLines.length > 0
                                            ? lyrics.findIndex(l => l === selectedLines[0])
                                            : -1;
                                        const isSelected =
                                            startIndex !== -1 &&
                                            index >= startIndex &&
                                            index < startIndex + numLines;

                                        return (
                                            <Typography
                                                key={index}
                                                variant="body2"
                                                sx={{
                                                    fontFamily: 'Spotify Mix',
                                                    cursor: 'pointer',
                                                    backgroundColor: isSelected ? 'rgba(30,144,255,0.25)' : 'transparent',
                                                    borderRadius: 1,
                                                    px: 1,
                                                    transition: 'background 0.2s'
                                                }}
                                                onClick={() => {
                                                    const newSelected = lyrics.slice(index, index + numLines);
                                                    setSelectedLines(newSelected);
                                                    setUsingCustomLyrics(false);
                                                }}
                                            >
                                                {line.words}
                                            </Typography>
                                        );
                                    })
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontFamily: 'Spotify Mix' }}>
                                            Unable to fetch lyrics for this song. Enter your own:
                                        </Typography>
                                        {customLyrics.map((line, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {customLyrics.length > 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => {
                                                            const updated = customLyrics.filter((_, i) => i !== idx);
                                                            setCustomLyrics(updated);
                                                            setSelectedLines(
                                                                updated.filter(l => l.trim()).map(words => ({ words }))
                                                            );
                                                            setUsingCustomLyrics(true);
                                                        }}
                                                        sx={{ minWidth: 0, border: 0 }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </Button>
                                                )}
                                                <TextField
                                                    value={line}
                                                    onChange={e => {
                                                        const updated = [...customLyrics];
                                                        updated[idx] = e.target.value;
                                                        setCustomLyrics(updated);
                                                        setSelectedLines(
                                                            updated.filter(l => l.trim()).map(words => ({ words }))
                                                        );
                                                        setUsingCustomLyrics(true);
                                                    }}
                                                    size="small"
                                                    placeholder={`Line ${idx + 1}`}
                                                    sx={{ flex: 1, fontFamily: 'Spotify Mix' }}
                                                    InputProps={{
                                                        style: { fontFamily: 'Spotify Mix' }
                                                    }}
                                                    onFocus={() => setUsingCustomLyrics(true)}
                                                />
                                            </Box>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                const updated = [...customLyrics, ""];
                                                setCustomLyrics(updated);
                                                setSelectedLines(
                                                    updated.filter(l => l.trim()).map(words => ({ words }))
                                                );
                                                setUsingCustomLyrics(true);
                                            }}
                                            sx={{ mt: 1, fontFamily: 'Spotify Mix', textTransform: 'none', width: 'fit-content' }}
                                        >
                                            Add Line
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                            {/* Number of Lines Selection */}
                            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                <Typography variant="body">
                                    Select Number of Lines
                                </Typography>
                                <select
                                    value={numLines}
                                    onChange={e => setNumLines(Number(e.target.value))}
                                    style={{
                                        borderRadius: 5,
                                        border: '1px solid #ccc',
                                        fontSize: 16,
                                        fontFamily: 'inherit',
                                        background: '#fafafa',
                                        color: '#232323',
                                        cursor: 'pointer',
                                        padding: 3
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </Box>
                        </>
                    ) : variant === "variant2" ? (
                        <>
                            {/* Timestamp Selection for Variant 2 */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body">
                                    Select Timestamp
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2, px: 1 }}>
                                <Slider
                                    min={0}
                                    max={songDurationSec}
                                    step={1}
                                    value={selectedTimestamp}
                                    onChange={(_, value) => setSelectedTimestamp(value)}
                                    sx={{
                                        color: '#ffffff',
                                    }}
                                    disabled={!songDurationSec}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="caption" sx={{ fontFamily: 'Spotify Mix' }}>
                                        {formatTime(selectedTimestamp)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'Spotify Mix' }}>
                                        {formatTime(songDurationSec)}
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    ) : null}

                    <Button
                        variant="contained"
                        sx={{
                            fontFamily: 'Spotify Mix',
                            textTransform: 'none',
                            boxShadow: 0,
                            borderRadius: 8,
                            backgroundColor: 'rgba(50, 50, 50, 0.7)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' },
                            mb: 1,
                        }}
                        onClick={handleDownload}
                        fullWidth
                    >
                        Save as PNG
                    </Button>

                    {/* Reinput Link Option */}
                    <Button
                        variant="contained"
                        sx={{
                            fontFamily: 'Spotify Mix',
                            textTransform: 'none',
                            boxShadow: 0,
                            borderRadius: 8,
                            backgroundColor: 'rgba(50, 50, 50, 0.7)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' },
                        }}
                        onClick={handleReinput}
                        fullWidth
                    >
                        Change Song
                    </Button>
                    <Box sx={{ mt: .5, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(230,230,230)' }}>
                            2 credits
                        </Typography>
                    </Box>
                    {/* Reinput Dialog */}
                    <Dialog open={reinputOpen} onClose={() => handleReinputClose(false)}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                p: 5,
                                alignItems: 'center',
                                fontFamily: 'Spotify Mix, Arial, sans-serif'
                            }}
                        >
                            <TextField
                                id="song-link"
                                variant="outlined"
                                label="Enter Song Link"
                                value={newLink}
                                onChange={e => setNewLink(e.target.value)}
                                sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                                autoFocus
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleReinputClose(true)}
                                sx={{ margin: 2, fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                                disabled={!newLink}
                            >
                                Create
                            </Button>
                            <Button
                                onClick={() => handleReinputClose(false)}
                                sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Dialog>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Container
                sx={{
                    ml: isMobile ? 0 : '260px',
                    mb: isMobile ? '340px' : 0,
                    overflowX: 'auto',
                    overflowY: 'auto',
                }}
            >
                <CallsLeft />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            transform: 'scale(.28)',
                            transformOrigin: 'top center',
                        }}
                    >
                        {variant === "variant1" && songData ? (
                            <SongVariant1
                                ref={variantRef}
                                songData={songData}
                                backgroundColor={backgroundColor}
                                textColor={textColor}
                                selectedLyrics={
                                    usingCustomLyrics
                                        ? customLyrics.filter(line => line.trim()).map(words => ({ words }))
                                        : selectedLines
                                }
                            />
                        ) : variant === "variant2" && songData ? (
                            <SongVariant2
                                ref={variantRef}
                                songData={songData}
                                backgroundColor={backgroundColor}
                                textColor={textColor}
                                selectedTimestamp={selectedTimestamp}
                            />
                        ) : null}
                    </div>
                </Box>
            </Container>
        </div>
    );
}

function isColorLight(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance;
}

function getContrastingColor(hex, amount = 150) {
    hex = hex.replace('#', '');
    let num = parseInt(hex, 16);
    let r = (num >> 16) & 0xFF;
    let g = (num >> 8) & 0xFF;
    let b = num & 0xFF;

    const luminance = isColorLight(hex);

    if (luminance > 0.8) {
        r = Math.max(0, r - 120);
        g = Math.max(0, g - 120);
        b = Math.max(0, b - 120);
        return `rgb(${r},${g},${b})`;
    }

    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return `rgb(${r},${g},${b})`;
}

function intToHexColor(int) {
    let hex = (int >>> 0).toString(16).padStart(6, '0');
    return `#${hex.slice(-6)}`;
}

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return `${min}:${s}`;
}

export default Song;