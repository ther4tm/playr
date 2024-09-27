import React from 'react';
import style from './searchResults.module.css';
import Tracklist from '../Tracklist/Tracklist';

const SearchResults = (props) => {
    const temp = props;
    return (
        <div className={style.container}>
            <h2 className={style.h2}>Results</h2>
            <Tracklist tracks={props.userSearch} addTrack={props.addTrack}/>
        </div>
    );
};

export default SearchResults;