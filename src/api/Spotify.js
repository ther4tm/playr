const client_id = 'c2cb88abd24d4165823ae16b0a943d5a'; 
const client_secret = 'd756375860f346559972a291430f8cf7';
const redirectUri = 'http://localhost:3000/';

//const Spotify = {
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

    return await response.json();
    };

   //Get track information function
    async function searchTracks(search) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=5`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
    });

    return await response.json();
    };

    //Get album information function
    async function searchAlbumTracks(search) {
    const accessToken = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3A%22${search}&type=track&limit=5`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
    });

    return await response.json();
    };

    //Get artist information function
    async function searchArtistTracks(search) {
        const accessToken = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3A%22${search}&type=track&limit=5`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken.access_token },
        });
    
        return await response.json();
        };

//};


const resources = {
    getAccessToken,
    searchTracks,
    searchAlbumTracks,
    searchArtistTracks
};

export default resources;

/* This is the format that the JSON response comes back as from the getAccessToken function
{
   "access_token": "some random numbers and letters that is the token",
   "token_type": "bearer",
   "expires_in": 3600
}
*/

const temp = "carrion";
const tempAlbum = "definitely maybe";
const tempArtist = "oasis";

/*
//Call for searching tracks
searchTracks(temp).then(track => {
    console.log(track.tracks.items)});
*/

/*
//Call for searching albums and returning tracks on matching albums
searchAlbumTracks(tempAlbum).then(track => {
    console.log(track.tracks.items)
});
*/

/*
//Call for searching artists and returning tracks by matching artists
searchArtistTracks(tempArtist).then(track => {
    console.log(track.tracks.items)
});
*/