import { BrowserRouter, Routes, Route } from "react-router-dom";
import Playlist from "./pages/Playlist";
import Song from "./pages/Song";
import Start from "./pages/Start";
import Album from "./pages/Album";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/album" element={<Album />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/song" element={<Song />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;