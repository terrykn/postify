import { Container, Box, Button, Dialog, TextField } from "@mui/material";
import Carousel from "../components/Carousel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    return (
        <div>
            <Dialog open={albumOpen} onClose={() => handleAlbumClose(albumLink)}>
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
                        id='album-link'
                        variant='outlined'
                        label='Enter Album Link'
                        value={albumLink}
                        onChange={e => setAlbumLink(e.target.value)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                        autoFocus
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAlbumClose(albumLink)}
                        sx={{ margin: 2, fontFamily: 'Gotham, Arial, sans-serif' }}
                        disabled={!albumLink}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setAlbumOpen(false)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
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
                        fontFamily: 'Gotham, Arial, sans-serif'
                    }}
                >
                    <TextField
                        id='playlist-link'
                        variant='outlined'
                        label='Enter Playlist Link'
                        value={playlistLink}
                        onChange={e => setPlaylistLink(e.target.value)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                        autoFocus
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePlaylistClose(playlistLink)}
                        sx={{ margin: 2, fontFamily: 'Gotham, Arial, sans-serif' }}
                        disabled={!playlistLink}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setPlaylistOpen(false)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
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
                        fontFamily: 'Gotham, Arial, sans-serif'
                    }}
                >
                    <TextField
                        id='song-link'
                        variant='outlined'
                        label='Enter Song Link'
                        value={songLink}
                        onChange={e => setSongLink(e.target.value)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                        autoFocus
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSongClose(songLink)}
                        sx={{ margin: 2, fontFamily: 'Gotham, Arial, sans-serif' }}
                        disabled={!songLink}
                    >
                        Create
                    </Button>
                    <Button
                        onClick={() => setSongOpen(false)}
                        sx={{ fontFamily: 'Gotham, Arial, sans-serif' }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Dialog>
            <Container>
                <Box sx={{ display: "flex", flexDirection: 'column', justifyContent: 'end', height: '20vh', alignItems: 'center' }}>
                    <h2>Create custom music posters for free!</h2>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
                    <Box sx={{ width: { lg: 240, md: 200, sm: 170, xs: 100 } }}>
                        <h1>Album</h1>
                        <Button variant="contained" color="primary" onClick={() => handleAlbumOpen()}>
                            Create Album Poster
                        </Button>
                    </Box>
                    <Box sx={{ width: { lg: 240, md: 200, sm: 170, xs: 100 } }}>
                        <h1>Playlist</h1>
                        <Button variant="contained" color="primary" onClick={() => handlePlaylistOpen()}>
                            Create Playlist Poster
                        </Button>
                    </Box>
                    <Box sx={{ width: { lg: 240, md: 200, sm: 170, xs: 100 } }}>
                        <h1>Song</h1>
                        <Button variant="contained" color="primary" onClick={() => handleSongOpen()}>
                            Create Song Poster
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}
export default Start;