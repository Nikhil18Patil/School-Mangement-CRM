import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const AuthAnimation = () => {
    return (
        <div style={{ width: '500px', height: '500px' }}>
            <Player
                autoplay
                loop
                src="https://lottie.host/7f5e42e3-8271-4e6a-a2c8-bcaacd1c94af/qcNfDgblLf.json"
                style={{ height: '100%', width: '100%' }}
            >
            </Player>
        </div>
    );
};


export default AuthAnimation;