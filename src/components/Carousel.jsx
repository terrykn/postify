import { Container, IconButton, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Carousel({ images, height = 200 }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Box sx={{ width: '100%', height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgb(225, 225, 225)',
                    background: 'rgba(0,0,0,0.3)',
                    '&:hover': { background: 'rgba(0,0,0,0.5)' },
                    zIndex: 2,
                }}
                aria-label="Previous"
            >
                <ArrowBackIosNewIcon />
            </IconButton>
            <Container disableGutters sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                    src={images[currentIndex]}
                    style={{
                        width: 'auto',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                    alt=""
                />
            </Container>
            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgb(225, 225, 225)',
                    background: 'rgba(0,0,0,0.3)',
                    '&:hover': { background: 'rgba(0,0,0,0.5)' },
                    zIndex: 2,
                }}
                aria-label="Next"
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
}
export default Carousel;