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

function Song() {
    const location = useLocation();
    const link = location.state?.link || '';

    // remove ?si= and anything after it before extracting the songId
    const cleanLink = link.includes('?si=') ? link.split('?si=')[0] : link;
    const songId = cleanLink.split('/').pop();

    const navigate = useNavigate();

    if(link === '') {
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

    const [songData, setSongData] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#232323');
    const [variant, setVariant] = useState('variant1');
    const [reinputOpen, setReinputOpen] = useState(false);
    const [newLink, setNewLink] = useState('');
    console.log(url);

    useEffect(() => {
        if (songData != null) {
            return;
        }
        console.log('API called');
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                setSongData(response.tracks[0]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [url, options]);

    const [lyrics, setLyrics] = useState([]);
    useEffect(() => {
        if (songData && lyrics.length === 0) {
            const lyricsUrl = process.env.REACT_APP_RAPIDAPI_SPOTIFY_URL + '/track_lyrics/?id=' + songId;
            const lyricsOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_SPOTIFY_KEY,
                    'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_SPOTIFY_HOST
                }
            };
            fetch(lyricsUrl, lyricsOptions)
                .then(response => response.json())
                .then(response => {
                    setLyrics(response.lyrics.lines);
                    const bgValue = response.colors.background;
                    const bgColor =
                      typeof bgValue === 'number'
                        ? intToHexColor(bgValue)
                        : (bgValue || '#232323');
                    setBackgroundColor(bgColor);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [songData, songId, lyrics]);

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

    return (
        <div style={{ display: 'flex' }}>
            {/* Permanent Drawer */}
            <Drawer
                variant="permanent"
                anchor="left"
                slotProps={{
                    paper: {
                        sx: { width: 260, boxSizing: 'border-box', p: 2 }
                    }
                }}
                open
            >
                <Box sx={{ p: 2 }}>
                    {/* Back Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => navigate('/')} size="small" sx={{ color: 'black', ml: -1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body">
                            Choose Color
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Custom circular color picker */}
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
                            <option value="variant1">1</option>
                            <option value="variant2">2</option>
                        </select>
                    </Box>

                    {/* Lyric Selection */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body">
                            Click to Choose Lyrics
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto', height: '30vh' }}>
                        {lyrics.length > 0 ? (
                            lyrics.map((line, index) => (
                                <p style={{ marginTop: 0, marginBottom: 1 }}>{line.words}</p>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No lyrics available
                            </Typography>
                        )}
                    </Box>

                    {/* Reinput Link Option */}
                    <Button
                        variant="outlined"
                        color="transparent"
                        onClick={handleReinput}
                        fullWidth
                        sx={{ mb: 1, fontFamily: 'Gotham', textTransform: 'none' }}
                    >
                        Change Song
                    </Button>
                    <Button
                        variant="outlined"
                        color="transparent"
                        onClick={handleDownload}
                        fullWidth
                        sx={{ fontFamily: 'Gotham', textTransform: 'none' }}
                    >
                        Save as PNG
                    </Button>
                </Box>
                {/* Reinput Dialog */}
                <Dialog open={reinputOpen} onClose={() => handleReinputClose(false)}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            p: 5,
                            alignItems: 'center',
                            fontFamily: 'Gotham, Arial, sans-serif'
                        }}
                    >
                        <TextField
                            id="song-link"
                            variant="outlined"
                            label="Enter Song Link"
                            value={newLink}
                            onChange={e => setNewLink(e.target.value)}
                            sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReinputClose(true)}
                            sx={{ margin: 2, fontFamily: 'Gotham, Arial, sans-serif' }}
                            disabled={!newLink}
                        >
                            Create
                        </Button>
                        <Button
                            onClick={() => handleReinputClose(false)}
                            sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Dialog>
            </Drawer>
            {/* Main content would go here */}
        </div>
    );
}

function isColorLight(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0,2),16);
    const g = parseInt(hex.substr(2,2),16);
    const b = parseInt(hex.substr(4,2),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance > 0.5;
}

function getContrastingColor(hex, amount = 140) {
    hex = hex.replace('#', '');
    let num = parseInt(hex, 16);
    let r = (num >> 16) & 0xFF;
    let g = (num >> 8) & 0xFF;
    let b = num & 0xFF;

    if (isColorLight(hex)) {
        r = Math.max(0, r - amount);
        g = Math.max(0, g - amount);
        b = Math.max(0, b - amount);
    } else {
        r = Math.min(255, r + amount);
        g = Math.min(255, g + amount);
        b = Math.min(255, b + amount);
    }
    return `rgb(${r},${g},${b})`;
}

// Helper function (add this to your file)
function intToHexColor(int) {
  let hex = (int >>> 0).toString(16).padStart(6, '0');
  return `#${hex.slice(-6)}`;
}

export default Song;