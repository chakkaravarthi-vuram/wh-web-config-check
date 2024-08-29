import React from 'react';

function Iframe(props) {
    const { src, title, onLoad } = props;
    return (
        <iframe src={src} title={title} onLoad={onLoad} sandbox="allow-scripts allow-same-origin">
            <p> Page not loaded</p>
        </iframe>
    );
}

export default Iframe;
