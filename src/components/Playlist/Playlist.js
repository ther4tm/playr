import React, { useState } from 'react';
import style from './playlist.module.css';
import Tracklist from '../Tracklist/Tracklist';

const Playlist = (props) => {

    return (
        <div className={style.container}>
            <input
            className={style.playlistInput}
            type='text'
            value={props.playlistName}
            onChange={props.onChange}
            />

            <Tracklist
            tracks={props.playlistTracks}
            onPlaylist={true}
            removeTrack={props.removeTrack}
            />
            
            <button
            className={style.button}
            onClick={props.onClick}
            >Save Playlist</button>

        </div>
    )
};

export default Playlist;