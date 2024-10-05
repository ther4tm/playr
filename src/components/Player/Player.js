import React from "react";
import style from './player.module.css';

const Player = (props) => {
    return (
        <div className={style.footer}>
            <div className={style.playerContainer}>
                <audio controls autoPlay src={props.previewLink.preview} />
            </div>
            <div className={style.trackInfoContainer}>
                <div className={style.trackTextContainer}>
                    <div className={style.songTitleContainer} >
                        <h3>{props.previewLink.name}</h3>
                    </div>
                    <div className={style.songArtistContainer}>
                        <p>{props.previewLink.artist}</p>
                    </div>
                </div>
                <div className={style.songArtworkContainer}>
                    <img
                    src={props.previewLink.artwork}
                    alt="Album artwork for previewed song"
                    />
                </div>
            </div>
        </div>
    )
};

export default Player;