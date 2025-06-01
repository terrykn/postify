import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Dialog, TextField, Container, Box, Drawer, Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import AlbumVariant1 from "../components/AlbumVariant1";
import AlbumVariant2 from "../components/AlbumVariant2";

function Album() {
  const location = useLocation();
  const link = location.state?.link || '';

  // remove ?si= and anything after it before extracting the albumId
  const cleanLink = link.includes('?si=') ? link.split('?si=')[0] : link;
  const albumId = cleanLink.split('/').pop();

  const navigate = useNavigate();

  if (link === '') {
    navigate('/');
  }

  const url = 'https://spotify23.p.rapidapi.com/albums/?ids=' + albumId;
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

  const [albumData, setAlbumData] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#232323");
  const [variant, setVariant] = useState("variant1");
  const [reinputOpen, setReinputOpen] = useState(false);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (albumData !== null) return;

    const cacheKey = `album_${albumId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      setAlbumData(cached);
      return;
    }

    console.log('[API CALL] fetching album data for albumId:', albumId);
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        setAlbumData(data);
        setCache(cacheKey, data);
      })
      .catch(err => console.error(err));
  }, [url, options, albumId]);

  const variantRef = useRef(null);

  const handleDownload = () => {
    if (!variantRef.current) return;
    htmlToImage.toPng(variantRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'album.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const exportSize = { width: 1080, height: 1080 };

  const textColor = getContrastingColor(backgroundColor || "#232323");
  const bgHex = backgroundColor.replace('#', '');
  const textHex = isColorLight(bgHex) ? 'black' : 'white';
  const spotifyCodeUrl = `https://scannables.scdn.co/uri/plain/png/${bgHex}/${textHex}/640/spotify:album:${albumId}`;

  const handleReinput = () => {
    setReinputOpen(true);
    setNewLink('');
  };
  const handleReinputClose = (submit) => {
    setReinputOpen(false);
    if (submit && newLink) {
      navigate('/album', { state: { link: newLink } });
      window.location.reload();
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
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
        <Box sx={{ p: 2 }}>
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
              <option value="variant1">Songs List</option>
              <option value="variant2">Cover Only</option>
            </select>
          </Box>


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
                mb: 1,
            }}
            onClick={handleReinput}
            fullWidth
          >
            Change Album
          </Button>
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
            onClick={handleDownload}
            fullWidth
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
            fontFamily: 'Spotify Mix, Arial, sans-serif'
          }}
        >
          <TextField
            id="album-link"
            variant="outlined"
            label="Enter Album Link"
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

      {/* Main Content */}
      <Container
        sx={{
          ml: isMobile ? 0 : '200px',
          mb: isMobile ? '340px' : 0,
          overflowX: 'auto',
          overflowY: 'auto',
          pt: 2,
        }}
      >
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
            <div style={{ width: 1080, height: 1080 }}>
              {variant === "variant2" ? (
                <AlbumVariant2
                  albumData={albumData}
                  backgroundColor={backgroundColor}
                />
              ) : (
                <AlbumVariant1
                  albumData={albumData}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  spotifyCodeUrl={spotifyCodeUrl}
                />
              )}
            </div>
          </div>
        </Box>
      </Container>

      {/* Hidden export version */}
      <div style={{ position: 'absolute', left: '-9999px', width: exportSize.width, height: exportSize.height, pointerEvents: 'none' }}>
        {variant === "variant2" ? (
          <AlbumVariant2
            ref={variantRef}
            albumData={albumData}
            backgroundColor={backgroundColor}
          />
        ) : (
          <AlbumVariant1
            ref={variantRef}
            albumData={albumData}
            exportSize={exportSize}
            forceFixedSize
            backgroundColor={backgroundColor}
            textColor={textColor}
            spotifyCodeUrl={spotifyCodeUrl}
          />
        )}
      </div>
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

function getContrastingColor(hex, amount = 180) {
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

export default Album;