import React from 'react';
import style from './track.module.css';

const Track = (props) => {
    const add = (event) => {
        props.addTrack(props.song); //Functions being passed down as props can still have arguments passed into them REMEMBER THIS!
    };

    const remove = (event) => {
        props.removeTrack(props.song); //Functions being passed down as props can still have arguments passed into them REMEMBER THIS!
    };

    const addRemove = () => {
        if (!props.onPlaylist) {
            return (
                <button className={style.addRemoveButton} onClick={add}>
                +
                </button>
            );
        } else {
            return (
                <button className={style.addRemoveButton} onClick={remove}>
                -
                </button>
            )
        }
    };

    return (
        <div className={style.container}>
            <div className={style.top}>
                <h3>{props.song.name}</h3>
                <div className={style.bottomleft}>
                    <h4>{props.song.artist}</h4>
                </div>
                <div className={style.bottomright}>
                    <h4>{props.song.album}</h4>
                </div>
            </div>
            <div className={style.addremove}>
                {addRemove()}
            </div>
        </div>
    );
};

export default Track;