import { BrowserRouter, Routes, Route } from "react-router-dom";
import Playlist from "./pages/Playlist";
import Song from "./pages/Song";
import Start from "./pages/Start";
import Album from "./pages/Album";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", 
      paper: "#1a1a1a",  
    },
    primary: {
      main: "#a259ff",
    },
  },
  typography: {
    fontFamily: "Spotify Mix, Arial, sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/album" element={<Album />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/song" element={<Song />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;