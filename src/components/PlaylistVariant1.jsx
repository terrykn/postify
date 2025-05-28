import { Box, Container } from "@mui/material";
import React from "react";

const PlaylistVariant1 = React.forwardRef(function PlaylistVariant1(
  { playlistData, backgroundColor, spotifyCodeUrl, textColor, coverType },
  ref
) {
  const trackAlbumImageUrls = playlistData
    ? Array.from(
        new Set(
          playlistData?.tracks?.items?.map(
            (track) => track.track.album.images[0].url
          )
        )
      )
    : [];
  const numImages = trackAlbumImageUrls.length;
  const ratio = 5 / 4;

  const rows = Math.floor(Math.sqrt(numImages / ratio));
  const columns = Math.floor(rows * ratio);

  let filledAlbumImages = trackAlbumImageUrls.slice(0, rows * columns);

  while (
    filledAlbumImages.length < rows * columns &&
    rows > 0 &&
    columns > 0
  ) {
    if (columns > rows) {
      columns--;
    } else {
      rows--;
    }
    filledAlbumImages = trackAlbumImageUrls.slice(0, rows * columns);
  }

  const playlistCoverImage = playlistData?.images?.[0]?.url || '';
  const playlistName = playlistData ? playlistData.name : "Loading...";
  const playlistTracks = playlistData ? playlistData.tracks.items : [];
  const playlistTracksNames = playlistTracks.map((track) => track.track.name);
  const displayedTracks = playlistTracksNames.slice(0, 30); // Show only first 30
  const remainingCount =
    playlistTracksNames.length > 30
      ? playlistTracksNames.length - 30
      : 0;

  const playlistTotalDuration = playlistTracks.reduce(
    (total, track) => total + track.track.duration_ms,
    0
  );
  const totalSeconds = Math.floor(playlistTotalDuration / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedDuration = `${hours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const numTracks = playlistTracksNames.length;
  let trackColumns = 1;
  if (numTracks > 10 && numTracks <= 20) {
    trackColumns = 2;
  } else if (numTracks > 20) {
    trackColumns = 3;
  }

  return (
    <div ref={ref}>
      <Container
        disableGutters
        style={{
          position: "relative", 
          backgroundColor: backgroundColor || "#232323",
          padding: 50,
        }}
      >
        {/* Gradient overlay at the bottom */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "20%",
            pointerEvents: "none",
            background: "linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0))",
            zIndex: 2,
          }}
        />
        {coverType === "albums" ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: 1.5,
              position: "relative",
              zIndex: 1,
            }}
          >
            {filledAlbumImages.map((imageUrl, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  paddingTop: "100%",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        ) : playlistCoverImage ? (
          <img
            src={playlistCoverImage}
            style={{ width: '100%', borderRadius: 10 }}
          />
        ) : (
          <Box sx={{ color: 'white', textAlign: 'center', mt: 5, zIndex: 1, position: 'relative' }}>
            This playlist does not have a cover.
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              color: textColor,
              fontFamily: "Gotham, Arial, sans-serif",
              fontWeight: "bold",
              marginTop: 30,
              fontSize: 52,
            }}
          >
            {playlistName}
          </h1>
          <h2 style={{ fontFamily: "Gotham", color: textColor, marginTop: 30 }}>
            {formattedDuration}
          </h2>
        </Box>
        <Box sx={{ marginTop: 1 }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              columns: trackColumns,
            }}
          >
            {displayedTracks.map((name, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: textColor,
                    margin: 0,
                    fontFamily: "Gotham, Arial, sans-serif",
                  }}
                >
                  {index + 1}. {name}
                </p>
              </li>
            ))}
            {remainingCount > 0 && (
              <li style={{ marginBottom: 4 }}>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: textColor,
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  ... and {remainingCount} more
                </p>
              </li>
            )}
          </ul>
        </Box>
        <Box>
            <img src={spotifyCodeUrl} alt="Spotify Code" style={{ width: '30%', height: 'auto', marginTop: 30, marginLeft: -20, marginBottom: -30 }} />
        </Box>
      </Container>
    </div>
  );
});

export default PlaylistVariant1;