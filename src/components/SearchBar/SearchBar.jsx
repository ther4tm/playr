import React from 'react';
import style from './searchBar.module.css';

const SearchBar = (props) => {
    return (
        <div className={style.container}>
            <form className={style.form}>
                <input
                className={style.input}
                type="text"
                placeholder="...Search..."
                value={props.search}
                onChange={props.onChange}
                />

                <div className={style.radio}>
                <label
                for="artist">Artist</label>

                <input
                type="radio"
                name="selector"
                id="artist"
                value="artist"
                onClick={props.onSelect}
                checked={props.selector === "artist"}/>

                <label
                for="album">Album</label>

                <input
                type="radio"
                name="selector"
                id="album"
                value="album"
                onClick={props.onSelect}
                checked={props.selector === "album"}/>

                <label
                for="title">Track</label>

                <input
                type="radio"
                name="selector"
                id="title"
                value="name"
                onClick={props.onSelect}
                checked={props.selector === "name"}/>
                </div>

                <button
                className={style.button}
                onClick={props.onClick}
                >Q</button>
            </form>
        </div>
    )
};

export default SearchBar;