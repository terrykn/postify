import { Container, Box, Button, Dialog, TextField, Typography } from "@mui/material";
import Carousel from "../components/Carousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import album1 from '../assets/hmhas_album.png';
import album2 from '../assets/eternal_sunshine_album.png';
import playlist1 from '../assets/jazz_lofi_playlist.png';
import playlist2 from '../assets/2010s_playlist.png';


import song3 from '../assets/supernatural_song.png';
import song4 from '../assets/viva_song.png';
import song5 from '../assets/viva_song_2.png';

import { getApiCallsLeft } from "../utils/rateLimit";

function useApiResetCountdown() {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        function updateCountdown() {
            const windowMs = 60 * 60 * 1000; // 1hr
            const key = 'api_call_timestamps';
            let timestamps = [];
            try {
                timestamps = JSON.parse(localStorage.getItem(key)) || [];
            } catch {
                timestamps = [];
            }
            const now = Date.now();
            timestamps = timestamps.filter(ts => now - ts < windowMs);
            if (timestamps.length === 0) {
                setTimeLeft(0);
                return;
            }
            const oldest = Math.min(...timestamps);
            const resetAt = oldest + windowMs;
            setTimeLeft(Math.max(0, resetAt - now));
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

function Start() {
    const [albumOpen, setAlbumOpen] = useState(false);
    const [albumLink, setAlbumLink] = useState('');
    const [playlistOpen, setPlaylistOpen] = useState(false);
    const [playlistLink, setPlaylistLink] = useState('');
    const [songOpen, setSongOpen] = useState(false);
    const [songLink, setSongLink] = useState('');

    const navigate = useNavigate();

    const handleAlbumOpen = () => {
        setAlbumOpen(true);
    }

    const handleAlbumClose = (link) => {
        setAlbumOpen(false);
        if (link) {
            navigate('/album', { state: { link } });
        }
    }

    const handlePlaylistOpen = () => {
        setPlaylistOpen(true);
    }
    const handlePlaylistClose = (link) => {
        setPlaylistOpen(false);
        if (link) {
            navigate('/playlist', { state: { link } });
        }
    }

    const handleSongOpen = () => {
        setSongOpen(true);
    }
    const handleSongClose = () => {
        setSongOpen(false);
        if (songLink) {
            navigate('/song', { state: { link: songLink } });
        }
    }

    const callsLeft = getApiCallsLeft();
    const timeLeft = useApiResetCountdown();

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            <Dialog open={albumOpen} onClose={() => handleAlbumClose(albumLink)}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        p: 5,
                        alignItems: 'center',
                        fontFamily: 'Spotify Mix, Arial, sans-serif',
                    }}
                >
                    <TextField
                        id='album-link'
                        variant='outlined'
                        label='Enter Spotify Album URL'
                        value={albumLink}
                        onChange={e => setAlbumLink(e.target.value)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        autoFocus
                        error={!!albumLink && !albumLink.includes('spotify.com/album')}
                        helperText={!!albumLink && !albumLink.includes('spotify.com/album') ? 'Please enter a valid Spotify Album URL' : ''}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAlbumClose(albumLink)}
                        sx={{ margin: 2, fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        disabled={!!albumLink && !albumLink.includes('spotify.com/album')}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setAlbumOpen(false)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Dialog>
            <Dialog open={playlistOpen} onClose={() => handlePlaylistClose(playlistLink)}>
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
                        id='playlist-link'
                        variant='outlined'
                        label='Enter Spotify Playlist URL'
                        value={playlistLink}
                        onChange={e => setPlaylistLink(e.target.value)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        autoFocus
                        error={!!playlistLink && !playlistLink.includes('spotify.com/playlist')}
                        helperText={!!playlistLink && !playlistLink.includes('spotify.com/playlist') ? 'Please enter a valid Spotify Playlist URL' : ''}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePlaylistClose(playlistLink)}
                        sx={{ margin: 2, fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        disabled={!!playlistLink && !playlistLink.includes('spotify.com/playlist')}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setPlaylistOpen(false)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Dialog>
            <Dialog open={songOpen} onClose={() => handleSongClose(songLink)}>
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
                        id='song-link'
                        variant='outlined'
                        label='Enter Spotify Song URL'
                        value={songLink}
                        onChange={e => setSongLink(e.target.value)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        autoFocus
                        error={!!songLink && !songLink.includes('spotify.com/track')}
                        helperText={!!songLink && !songLink.includes('spotify.com/track') ? 'Please enter a valid Spotify Song URL' : ''}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSongClose(songLink)}
                        sx={{ margin: 2, fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                        disabled={!!songLink && !songLink.includes('spotify.com/track')}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setSongOpen(false)}
                        sx={{ fontFamily: 'Spotify Mix, Arial, sans-serif' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Dialog>
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    px: { xs: 1, sm: 2, md: 4 },
                    pb: { xs: 2, md: 0 },
                }}
            >
                <Box
                    sx={{
                        pt: { xs: 3, md: 3 }, 
                        pb: { xs: 3, md: 3 },
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            fontFamily: 'Spotify Mix, Arial, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', md: '1.5rem' },
                            color: 'white',
                            letterSpacing: 1,
                        }}
                    >
                        Create a Free Custom Music Poster
                    </Box>
                    <Box
                        sx={{
                            fontFamily: 'Spotify Mix, Arial, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '1rem', md: '1rem' },
                            color: 'white',
                            letterSpacing: 1,
                        }}
                    >
                        {callsLeft} credits remaining
                        {callsLeft < 40 && (
                            <span style={{ marginLeft: 8 }}>
                                {timeLeft === 0
                                    ? "Credits reset!"
                                    : `(resets in: ${formatMs(timeLeft)})`}
                            </span>
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 1.5,
                        
                        
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'rgba(40,40,40,0.7)',
                            borderRadius: 2,
                            p: 3,
                        }}
                    >
                        <Box sx={{ width: '100%', height: 350, mb: 2 }}>
                            <Carousel images={[album1, album2]} height={350} />
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                fontFamily: 'Spotify Mix',
                                textTransform: 'none',
                                boxShadow: 0,
                                borderRadius: 8,
                                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' }
                            }}
                            onClick={handleAlbumOpen}
                        >
                            Create Album Poster
                        </Button>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(230,230,230)' }}>
                                1 credit
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'rgba(40,40,40,0.7)',
                            borderRadius: 2,
                            p: 3,
                        }}
                    >
                        <Box sx={{ width: '100%', height: 350, mb: 2 }}>
                            <Carousel images={[playlist1, playlist2]} height={350} />
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                fontFamily: 'Spotify Mix',
                                textTransform: 'none',
                                boxShadow: 0,
                                borderRadius: 8,
                                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' }
                            }}
                            onClick={handlePlaylistOpen}
                        >
                            Create Playlist Poster
                        </Button>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(230,230,230)' }}>
                                1 credit
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'rgba(40,40,40,0.7)',
                            borderRadius: 2,
                            p: 3,
                        }}
                    >
                        <Box sx={{ width: '100%', height: 350, mb: 2 }}>
                            <Carousel images={[song3, song5, song4]} height={350} />
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                fontFamily: 'Spotify Mix',
                                textTransform: 'none',
                                boxShadow: 0,
                                borderRadius: 8,
                                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(65, 65, 65, 0.7)' }
                            }}
                            onClick={handleSongOpen}
                        >
                            Create Song Poster
                        </Button>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(230,230,230)' }}>
                                2 credits
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}
export default Start;