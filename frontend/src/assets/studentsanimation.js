import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottieAnimation = () => {
    return (
        <div style={{ width: '500px', height: '500px' }}>
            <Player
                autoplay
                loop
                src="https://lottie.host/20a71a17-7daf-40a3-b37f-9d366a5f4b7c/3sVP2bpP0Q.json"
                style={{ height: '100%', width: '100%' }}
                rel="preload"
            >
            </Player>
        </div>
    );
};


export default LottieAnimation;