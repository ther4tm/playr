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
                <h3 className={style.text}>{props.song.name}</h3>
                <div className={style.bottomleft}>
                    <p className={style.text}>{props.song.artist}</p>
                </div>
                <div className={style.bottomright}>
                    <p className={style.text}>{props.song.album}</p>
                </div>
            </div>
            <div className={style.addremove}>
                {addRemove()}
            </div>
        </div>
    );
};

export default Track;