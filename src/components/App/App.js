import React, { useState } from 'react';
import style from './app.module.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import resources from '../../api/Spotify';

//Hard coded fake catalogue for testing
//import catalogue from "../FakeDataForTesting/FakeDataForTesting.mjs"

const {
  searchTracks,
  searchAlbumTracks,
  searchArtistTracks
} = resources;

const App = () => {
  const [search, setSearch] = useState(''); // Temporary state until spotify API is connected to provide a search submission point
  const [selected, setSelected] = useState([]); // Temporary hard code state while search selector is being built
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [choice, setChoice] = useState("name"); //This selects what content the user is searching for artist song, name or album

  const handleChange = ({target}) => {
      setSearch(target.value);
  };

  const handleChoice = ({target}) => {
    setChoice(target.value);
  };

  const handlePlaylistName = ({target}) => {
    setPlaylistName(target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    /*
    //This is all for the hardcoded static search before its hooked up to the Spotify API
    // This function enables any case partial search of the catalogue
    const partialSearch = (arr, query) => {
      return arr.filter((placeHolder) => placeHolder[choice].toLowerCase().includes(query.toLowerCase()));
    };
    // Needs to return the state to an array otherwise it will say the .map of the Track component is not a function because its trying to map something that isnt an array
    setSelected(partialSearch(catalogue, search));
    */

  //Handles the search dependant on what radio button is seleected    
  if (choice === "name") {
    return searchTracks(search).then(track => {
        setSelected(track.tracks.items.map((result) => ({
          id: result.id,
          name: result.name,
          artist: result.artists[0].name,
          album: result.album.name,
          uri: result.uri
        })))
    });
    } else if (choice === "album") {
    return searchAlbumTracks(search).then(track => {
        setSelected(track.tracks.items.map((result) => ({
          id: result.id,
          name: result.name,
          artist: result.artists[0].name,
          album: result.album.name,
          uri: result.uri
        })));
        });
    } else {
    return searchArtistTracks(search).then(track => {
      setSelected(track.tracks.items.map((result) => ({
        id: result.id,
        name: result.name,
        artist: result.artists[0].name,
        album: result.album.name,
        uri: result.uri
      })));
      });
    };
  };

  const addTrack = (track) => {
    if (playlistTracks.some((savedPlaylistTracks) => savedPlaylistTracks.id === track.id)) //Checks if the song is already on the playlist and returns no action if it is
      return;

    setPlaylistTracks((prev) => {
      return [...prev, track];
    });
  };

  const removeTrack = (track) => {
    setPlaylistTracks((prev) => {
      return prev.filter((savedPlaylistTrack) => savedPlaylistTrack.id !== track.id);
    });
  };

  return (
    <div className={style.container}>
      <h1 className={style.h1}>Playr</h1>
      
      <SearchBar
      value={search}
      onChange={handleChange}
      onClick={handleSearch}
      onSelect={handleChoice}
      selector={choice}
      />

      <div className={style.columns}>
        
        <SearchResults 
        userSearch={selected}
        addTrack={addTrack}
        />

        <Playlist
        playlistTracks={playlistTracks}
        removeTrack={removeTrack}
        value={playlistName}
        onChange={handlePlaylistName}
        playlistName={playlistName}
        />
      </div>
    </div>
  );
}

export default App;