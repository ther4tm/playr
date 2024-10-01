import React from 'react';
import style from './tracklist.module.css';
import Track from '../Track/Track';

const Tracklist = (props) => {
    return (
        <div className={style.container}>
        {props.tracks.map((song) => {
            return (
                <Track
            song={song}
            key={song.id}
            addTrack={props.addTrack}
            onPlaylist={props.onPlaylist}
            removeTrack={props.removeTrack}
            />
        );
    })}
        </div>
    );
};

export default Tracklist;