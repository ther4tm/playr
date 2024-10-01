/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code with PKCE oAuth2 flow to authenticate 
 * against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

const clientId = 'c2cb88abd24d4165823ae16b0a943d5a'; // your clientId
const redirectUrl = 'http://localhost:3000';        // your redirect URL - must be localhost URL and/or HTTPS

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

//This whole status section needs to reworked after problem of playlist submission is fixed
// If we have a token, we're logged in, so fetch user data and render logged in indicator
if (currentToken.access_token) {
  userData = await getUserData();
  //renderTemplate("main", "logged-in-template", userData);
  //renderTemplate("oauth", "oauth-template", currentToken);
}

// Otherwise we're not logged in, so render the login request
if (!currentToken.access_token) {
  //renderTemplate("main", "login");
}


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
    if (!playlistName || !trackUris.length) { //Makes sure both playlist and name are not empty
      return;
    }
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
    const response = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get album information function
    async function searchAlbumTracks(search) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3A%22${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute //q=album%3A%22 is the part of the url that is the filter by album section of the fetch
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get artist information function
    async function searchArtistTracks(search) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3A%22${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
        });
    
        return await response.json(); //converts the response to JSON
        };

const resources = {
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

/*

// HTML Template Rendering with basic data binding - demoware only.
function renderTemplate(targetId, templateId, data = null) {
  const template = document.getElementById(templateId);
  const clone = template.content.cloneNode(true);

  const elements = clone.querySelectorAll("*");
  elements.forEach(ele => {
    const bindingAttrs = [...ele.attributes].filter(a => a.name.startsWith("data-bind"));

    bindingAttrs.forEach(attr => {
      const target = attr.name.replace(/data-bind-/, "").replace(/data-bind/, "");
      const targetType = target.startsWith("onclick") ? "HANDLER" : "PROPERTY";
      const targetProp = target === "" ? "innerHTML" : target;

      const prefix = targetType === "PROPERTY" ? "data." : "";
      const expression = prefix + attr.value.replace(/;\n\r\n/g, "");

      // Maybe use a framework with more validation here ;)
      try {
        ele[targetProp] = targetType === "PROPERTY" ? eval(expression) : () => { eval(expression) };
        ele.removeAttribute(attr.name);
      } catch (ex) {
        console.error(`Error binding ${expression} to ${targetProp}`, ex);
      }
    });
  });

  const target = document.getElementById(targetId);
  target.innerHTML = "";
  target.appendChild(clone);
}

*/