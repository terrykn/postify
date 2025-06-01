import { Box, Container } from "@mui/material";
import React from "react";

const AlbumVariant2 = React.forwardRef(function AlbumVariant2({ albumData, backgroundColor, coverType }, ref) {
    const album = albumData?.albums?.[0];
    const albumCoverImage = album?.images?.[0]?.url || '';

    return (
        <div ref={ref}>
            <Container
                disableGutters
                style={{
                    position: 'relative',
                    backgroundColor,
                    padding: 80,
                }}
            >
                {coverType === "albums" ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(1, 1fr)',
                            gap: 1.5,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                paddingTop: '100%',
                                backgroundImage: `url(${albumCoverImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                ) : albumCoverImage ? (
                    <img
                        src={albumCoverImage}
                        style={{ width: '100%', borderRadius: 10 }}
                        alt={album?.name}
                    />
                ) : (
                    <Box
                        sx={{
                            color: 'white',
                            textAlign: 'center',
                            mt: 5,
                            zIndex: 1,
                            position: 'relative',
                        }}
                    >
                        This album does not have a cover.
                    </Box>
                )}
            </Container>
        </div>
    );
});

export default AlbumVariant2;