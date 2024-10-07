import React, { useState } from 'react';
import style from './app.module.css';
import SearchBar from '../SearchBar/SearchBar.jsx';
import SearchResults from '../SearchResults/SearchResults.jsx';
import Playlist from '../Playlist/Playlist.jsx';
import LoginLogoutButtons from '../LoginLogout/LoginLogout.jsx';
import Player from '../Player/Player.jsx';
import resources from '../../api/Spotify.js';

const {
  currentToken,
  searchTracks,
  searchAlbumTracks,
  searchArtistTracks,
  loginWithSpotifyClick,
  logoutClick,
  refreshTokenClick,
  savePlaylist,
  userData
} = resources;

const App = () => {
  const [search, setSearch] = useState(''); // User Search
  const [selected, setSelected] = useState([]); // Stores tracks returned by Spotify
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [choice, setChoice] = useState("name"); //This selects what content the user is searching for artist song, name or album
  const [songPreview, setSongPreview] = useState(''); //This sets the preview url for the preview player

  const handleChange = ({target}) => {
      setSearch(target.value);
  };

  const handleChoice = ({target}) => {
    setChoice(target.value);
  };

  const handlePlaylistName = ({target}) => {
    setPlaylistName(target.value);
  };

  const handleSongPreview = (song) => {
    setSongPreview(song);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (!search) {
      return;
    }
    refreshTokenClick();

    //Handles the search dependant on what radio button is seleected
    if (choice === "name") {
      return searchTracks(search).then(track => {
          setSelected(track.tracks.items.map((result) => ({
            id: result.id,
            name: result.name,
            artist: result.artists[0].name,
            album: result.album.name,
            uri: result.uri,
            preview: result.preview_url,
            artwork: result.album.images[0].url
          })))
      });
    } else if (choice === "album") {
      return searchAlbumTracks(search).then(track => {
          setSelected(track.tracks.items.map((result) => ({
            id: result.id,
            name: result.name,
            artist: result.artists[0].name,
            album: result.album.name,
            uri: result.uri,
            preview: result.preview_url,
            artwork: result.album.images[0].url
          })));
        });
    } else {
      return searchArtistTracks(search).then(track => {
        setSelected(track.tracks.items.map((result) => ({
          id: result.id,
          name: result.name,
          artist: result.artists[0].name,
          album: result.album.name,
          uri: result.uri,
          preview: result.preview_url,
          artwork: result.album.images[0].url
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

  const handleSubmitPlaylist = () => {
    const trackUris = playlistTracks.map((track) => track.uri); //Pulls all uris from the created playlist state to push to spotify when creating the playlist
    if (!playlistName || !trackUris.length) { //Makes sure both playlist and name are not empty
      return alert("Please provide Playlist name and tracks before saving to Spotify.");
    } else {
    savePlaylist(playlistName, trackUris);
    setPlaylistName('');
    setPlaylistTracks([]);
    return alert("Playlist saved!");
    }
  };

  //Login splash
  if (!currentToken.access_token) {
    return (
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.logo}>
            <h1 className={style.h1}>Playr</h1>
          </div>
        </div>
        <div className={style.loginButton}>
          <LoginLogoutButtons
          login={loginWithSpotifyClick}
          />
        </div>
      </div>
    );
  }

  //App once logged in
  if (currentToken.access_token) {
    return (
      <>
        <div className={style.container}>
          <div className={style.logo}>
            <h1 className={style.h1}>Playr</h1>
          </div>
          <LoginLogoutButtons
          userData={userData}
          logout={logoutClick}
          refresh={refreshTokenClick}
          />
          
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
            preview={handleSongPreview}
            />

            <Playlist
            playlistTracks={playlistTracks}
            removeTrack={removeTrack}
            value={playlistName}
            onChange={handlePlaylistName}
            playlistName={playlistName}
            onClick={handleSubmitPlaylist}
            preview={handleSongPreview}
            />
          </div>
        </div>
        <Player
        previewLink={songPreview}
        />
      </>
    );
  }
}

export default App;