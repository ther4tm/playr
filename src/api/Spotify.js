/*
 * The top half of this code before the API calls are pulled directly from Spotify
 * They provide PKCE oAuth2 to authenticate against the Spotify Accounts.
 *
 * Source can be found here;
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

const clientId = 'c2cb88abd24d4165823ae16b0a943d5a'; // your clientId
const redirectUrl = 'http://localhost:5173';        // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private'; //These are what the app will be allowed to do on behalf of Spotify

let userData;

// Data structure that manages the current active token, caching it in localStorage
  const currentToken = {
    get access_token() { return localStorage.getItem('access_token') || null; },
    get refresh_token() { return localStorage.getItem('refresh_token') || null; },
    get expires_in() { return localStorage.getItem('refresh_in') || null },
    get expires() { return localStorage.getItem('expires') || null },

    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);

      const now = new Date();
      const expiry = new Date(now.getTime() + (expires_in * 1000));
      localStorage.setItem('expires', expiry);
    }
  };

// On page load, try to fetch auth code from current browser search URL
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

// If we find a code, we're in a callback, do a token exchange
  if (code) {
    const token = await getToken(code);
    currentToken.save(token);

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");

    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  }

// If we have a token, we're logged in, so fetch user data and render logged in indicator
  if (currentToken.access_token) {
    userData = await getUserData();
  }

//Spotify Login and Auth
  async function redirectToSpotifyAuthorize() {
    //code verifier
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64)); //encoding value can be between 43 and 128 (the longer the better)
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    window.localStorage.setItem('code_verifier', code_verifier);

    const authUrl = new URL(authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

// Spotify API Calls
  async function getToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });

    return await response.json();
  };

  async function refreshToken() {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: currentToken.refresh_token
      }),
    });

    return await response.json();
  };

  //Get User info
  async function getUserData() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });

    return await response.json();
  };

  //Create playlists
  async function createPlaylist(playlistName) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + currentToken.access_token,
          'Content-Type': 'application/json'
          },
        body: JSON.stringify ({
          "name": `${playlistName}`
        })
    });

    return await response.json(); //converts the response to JSON
  };

  //Add Items to playlist
  async function addItemsToPlaylist(playlistId, trackUris) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uris: trackUris})
    });

    return await response.json();
  };




// Click handlers
  //Save playlist
  const savePlaylist = (playlistName, trackUris) => {
    createPlaylist(playlistName).then(response => { //Creates a playlist
      const playlistId = response.id; //Get the Id for the created playlist to use in next step
      addItemsToPlaylist(playlistId, trackUris) //Add tracks to new playlist
    });
    
  };

  async function loginWithSpotifyClick() { //Login
    await redirectToSpotifyAuthorize();
  };

  async function logoutClick() { //Logout
    await localStorage.clear();
    window.location.href = redirectUrl;
  };

  async function refreshTokenClick() { //Refresh token
    const token = await refreshToken();
    currentToken.save(token);
  };



//Searches
   //Get track information function
   async function searchTracks(search) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=15`, { //Limited to 15 tracks at the minute
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get album information function
    async function searchAlbumTracks(search) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3A%22${search}&type=track&limit=15`, { //Limited to 15 tracks at the minute //q=album%3A%22 is the part of the url that is the filter by album section of the fetch
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get artist information function
    async function searchArtistTracks(search) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3A%22${search}&type=track&limit=15`, { //Limited to 15 tracks at the minute
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
        });
    
        return await response.json(); //converts the response to JSON
        };

const resources = {
  currentToken,
  searchTracks,
  searchAlbumTracks,
  searchArtistTracks,
  loginWithSpotifyClick,
  logoutClick,
  refreshTokenClick,
  savePlaylist,
  userData
};

export default resources;