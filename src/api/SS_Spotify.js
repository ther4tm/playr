const client_id = 'c2cb88abd24d4165823ae16b0a943d5a'; 
const client_secret = 'd756375860f346559972a291430f8cf7';
const redirectUri = 'http://localhost:3000/';


    //Get access token function
    async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
        'grant_type': 'client_credentials',
        }),
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')), //this buffer section concatenates the id and secret and then encodes it base64 format
        },
    });

    /* This is the format that the JSON response comes back as from the getAccessToken function
{
   "access_token": "some random numbers and letters that is the token",
   "token_type": "bearer",
   "expires_in": 3600              //1 hour
}
*/

    return await response.json(); //converts the response to JSON
    };

   //Get track information function
    async function searchTracks(search) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get album information function
    async function searchAlbumTracks(search) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3A%22${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute //q=album%3A%22 is the part of the url that is the filter by album section of the fetch
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
    });

    return await response.json(); //converts the response to JSON
    };

    //Get artist information function
    async function searchArtistTracks(search) {
        const accessToken = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3A%22${search}&type=track&limit=5`, { //Limited to 5 tracks at the minute
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
        });
    
        return await response.json(); //converts the response to JSON
        };

        const userId = "ther4tm";

    //Create Playlist
    async function createPlaylist(playlistName) {
        const accessToken = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken.access_token
            },
            body: {
                "name": `${playlistName}`,
                "description": "New playlist",
                "public": true
            }
        });
    
        return await response.json(); //converts the response to JSON
        };









        const userName = "ther4tm";

    //Get users playlists
    async function getPlaylists(userName) {
        const accessToken = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/users/${userName}/playlists`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
        });
    
        return await response.json(); //converts the response to JSON
        };

/*

const resources = {
    searchTracks,
    searchAlbumTracks,
    searchArtistTracks
};

export default resources;*/

createPlaylist("test").then((response) => {console.log(response)});

//getPlaylists(userName).then((response) => {console.log(response)});