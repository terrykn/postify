import { Container } from '@mui/material';
import { useState, useEffect } from 'react';

function Carousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div style={{ width: '100%' }}>
            <Container disableGutters>
                <img 
                    src={images[currentIndex]}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'block',
                        margin: '0 auto'
                    }}
                    alt=""
                />
            </Container>
        </div>
    );
}
export default Carousel;