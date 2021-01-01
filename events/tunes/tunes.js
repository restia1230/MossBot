require('coffee-script/register');
var gapi = require('gapi');
const ytdl = require('ytdl-core');
var { google } = require('googleapis');
var readline = require('readline');

const fs = require("fs");
var OAuth2 = google.auth.OAuth2;
const yTokenA = process.env.youtubeaccess;
const yTokenR = process.env.youtuberefresh;
const clientSecret1 = process.env.yClientSecret;
const youtubeID = process.env.youtubeID;
const yRedirect = process.env.yRedirect

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtubepartner', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl'];
var TOKEN_DIR = './credentials/';
var TOKEN_PATH = 'token.json';
var oAuth2Client;

// Load client secrets from a local file.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(callback) {
    var clientSecret = clientSecret1;
    var clientId = youtubeID;
    var redirectUrl = yRedirect;
    oAuth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.

    // getNewToken(oAuth2Client, callback);
    callback(oAuth2Client);
    return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oAuth2Client, callback) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oAuth2Client.credentials = token;
            storeToken(token);
            callback(oAuth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    console.log(token)
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
    var service = google.youtube('v3');
    service.channels.list({
        auth: auth,
        part: 'snippet,contentDetails,statistics',
        forUsername: 'GoogleDevelopers'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
            console.log('No channel found.');
        } else {
            console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                'it has %s views.',
                channels[0].id,
                channels[0].snippet.title,
                channels[0].statistics.viewCount);
        }
    });
}


module.exports.run = (client, message) => {
    // var oAuth2Client;
    addtolist();
    // Authorize a client with the loaded credentials, then call the YouTube API.
    async function addtolist() {
        await authorize(getChannel);
        var cred = { "access_token": yTokenA, "refresh_token": yTokenR, "scope": "https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube", "token_type": "Bearer", "expiry_date": 1608712895125 };

        oAuth2Client.credentials = cred;
        console.log(oAuth2Client)
        const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

        if (ytdl.validateURL(message.content)) {
            var yID = ytdl.getURLVideoID(message.content);
            // console.log(youtube);
            youtube.playlistItems.insert({
                "part": [
                    "snippet"
                ],
                "resource": {
                    "snippet": {
                        "playlistId": "PLFpntKzJ_jiDekaL3zQMcnCakd1yXkBow",
                        "position": 0,
                        "resourceId": {
                            "kind": "youtube#video",
                            "videoId": yID
                        }
                    }
                }
            })
                .then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                },
                    function (err) { console.log(err)});
        }
    }



}