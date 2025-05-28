import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Dialog, TextField } from "@mui/material";

import PlaylistVariant1 from "../components/PlaylistVariant1";
import PlaylistVariant2 from "../components/PlaylistVariant2"; 

import { Container, Box, Drawer, Typography, Button } from "@mui/material";

function Playlist() {
  const location = useLocation();
  const link = location.state?.link || '';
  const playlistId = link.split('/').pop();
  
  const navigate = useNavigate();

  if(link === '') {
    navigate('/');
  }

  const url = process.env.REACT_APP_RAPIDAPI_SPOTIFY_URL + '/playlist/?id=' + playlistId;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_SPOTIFY_KEY,
      'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_SPOTIFY_HOST
    }
  };

  const [playlistData, setPlaylistData] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#232323");
  const [variant, setVariant] = useState("variant1");

  const [coverType, setCoverType] = useState("albums");

  const [reinputOpen, setReinputOpen] = useState(false);
  const [newLink, setNewLink] = useState('');

  console.log(url);

  useEffect(() => {
    if (playlistData !== null) return; 
    console.log('API called');
    fetch(url, options)
      .then(response => response.json())
      .then(data => setPlaylistData(data))
      .catch(err => console.error(err));
  }, [url, options]);

  const variantRef = useRef(null);

  const handleDownload = () => {
    if (!variantRef.current){
      console.log('Variant ref is null');
      return;
    }
    htmlToImage.toPng(variantRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'playlist.png';
        link.href = dataUrl;
        link.click();
        console.log('Download initiated');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const exportSize = { width: 1080, height: 1080 };

  const textColor = getContrastingColor(backgroundColor || "#232323");
  const bgHex = backgroundColor.replace('#', '');
  const textHex = isColorLight(bgHex) ? 'black' : 'white';
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/${bgHex}/${textHex}/640/spotify:playlist:${playlistId}`;

  // Handler for reinput dialog
  const handleReinput = () => {
    setReinputOpen(true);
    setNewLink('');
  };
  const handleReinputClose = (submit) => {
    setReinputOpen(false);
    if (submit && newLink) {
      navigate('/playlist', { state: { link: newLink } });
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
              <option value="variant1">Songs List</option>
              <option value="variant2">Cover Only</option>
            </select>
          </Box>
          {/* Cover Type */}
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body">
              Cover Type
            </Typography>
            <select
              value={coverType}
              onChange={e => setCoverType(e.target.value)}
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
              <option value="default">Default</option>
              <option value="albums">Albums</option>
            </select>
          </Box>

          {/* Reinput Link Option */}
          <Button
            variant="outlined"
            color="transparent"
            onClick={handleReinput}
            fullWidth
            sx={{ mb: 1, fontFamily: 'Gotham', textTransform: 'none' }}
          >
            Change Playlist
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
      </Drawer>

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
            id="playlist-link"
            variant="outlined"
            label="Enter Playlist Link"
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

      {/* Main Content */}
      <Container sx={{ ml: '200px', overflowX: 'auto', overflowY: 'hidden', height: '90vh' }}>
        <Box>
          <Box>
            <div
              style={{
                transform: 'scale(.28)', 
                transformOrigin: 'top center',
              }}
            >
              <div style={{ width: 1080, height: 1080 }}>
                {variant === "variant2" ? (
                  <PlaylistVariant2
                    playlistData={playlistData}
                    backgroundColor={backgroundColor}
                    coverType={coverType}
                  />
                ) : (
                  <PlaylistVariant1
                    playlistData={playlistData}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    spotifyCodeUrl={spotifyCodeUrl}
                    coverType={coverType}
                  />
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Container>

      {/* Hidden export version */}
      <div style={{ position: 'absolute', left: '-9999px', width: exportSize.width, height: exportSize.height, pointerEvents: 'none' }}>
        {variant === "variant2" ? (
          <PlaylistVariant2
            ref={variantRef}
            playlistData={playlistData}
            backgroundColor={backgroundColor}
            coverType={coverType}
          />
        ) : (
          <PlaylistVariant1
            ref={variantRef}
            playlistData={playlistData}
            exportSize={exportSize}
            forceFixedSize
            backgroundColor={backgroundColor}
            textColor={textColor}
            spotifyCodeUrl={spotifyCodeUrl}
            coverType={coverType}
          />
        )}
      </div>
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

function getContrastingColor(hex, amount = 150) {
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

export default Playlist;