import { Box, Container } from "@mui/material";
import React from "react";

const PlaylistVariant2 = React.forwardRef(function PlaylistVariant2({ playlistData, backgroundColor, coverType }, ref) {
    const trackAlbumImageUrls = playlistData
        ? Array.from(
            new Set(
                playlistData.tracks.items
                    .map(item =>
                        item?.track?.album?.images?.[0]?.url
                    )
                    .filter(Boolean)
            )
        )
        : [];

    const numImages = trackAlbumImageUrls.length;
    const squareSize = Math.floor(Math.sqrt(numImages));
    const perfectSquare = squareSize * squareSize;
    const filledAlbumImages = trackAlbumImageUrls.slice(0, perfectSquare);
    const columns = squareSize;
    const playlistCoverImage = playlistData?.images?.[0]?.url || '';

    return (
        <div ref={ref}>
            <Container
                disableGutters
                style={{
                    position: 'relative',
                    backgroundColor: backgroundColor || '#232323',
                    padding: 80
                }}
            >
                {coverType === "albums" ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 1.5, position: 'relative', zIndex: 1 }}>
                        {filledAlbumImages.map((imageUrl, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
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
            </Container>
        </div>
    );
});

export default PlaylistVariant2;