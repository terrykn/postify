import { Box, Container } from "@mui/material";
import React from "react";

const SongVariant1 = React.forwardRef(function SongVariant1(
  { songData, backgroundColor, spotifyCodeUrl, textColor },
  ref
) {

  return (
    <Container ref={ref} style={{ backgroundColor, color: textColor }}>
      <Box>
        
      </Box>
    </Container>
  );
});

