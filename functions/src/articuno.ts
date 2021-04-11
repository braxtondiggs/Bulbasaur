
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';
import * as ffmpeg from 'fluent-ffmpeg';
import * as admin from 'firebase-admin';
var { google } = require('googleapis');

const finalFileName = 'output.mkv';
export async function convert2YT() {
  const bucket = admin.storage().bucket();
  const [videoFiles] = await bucket.getFiles({ prefix: 'articuno' });
  const [imageFiles] = await bucket.getFiles({ prefix: 'articuno/images' });
  const video = videoFiles.find((o) => o.name.includes('webm'));
  const image = imageFiles.find((o) => ['.jpg', '.jpeg', '.png'].some(ext => o.name.includes(ext)));

  if (video && image) {
    const name: string = image.name.split('/').slice(-1)[0];
    const tempImagePath = path.join(os.tmpdir(), name);

    const videoStream = bucket.file(video.name).createReadStream();
    await bucket.file(image.name).download({ destination: tempImagePath });

    ffmpeg(videoStream)
      .videoCodec('libx264')
      .audioCodec('copy')
      .input(tempImagePath)
      .inputOption('-loop 1')
      .outputOptions(['-preset medium', '-crf 18', '-tune stillimage', '-shortest'])
      .on('progress', function (progress) {
        if (progress.percent) {
          console.log(`Rendering: ${progress.percent}% done`)
        }
      })
      .on('codecData', function (data) {
        console.log('codecData=', data);
      })
      .on('end', function () {
        console.log('Video has been converted succesfully');
        const title: string = decodeURIComponent(video.name.split('/').slice(-1)[0].replace('.webm', ''));
        upload2YT(title).catch(console.error);
      })
      .on('error', function (err) {
        console.log('errer rendering video: ' + err.message);
      })
      .output(finalFileName).run();
  }
}

export async function upload2YT(title: string) {
  const OAuth2 = google.auth.OAuth2;
  const config = admin.remoteConfig();
  const template = await config.getTemplate();
  let { articuno_secret_client: client, articuno_access_token: token } = template.parameters;
  client = JSON.parse((client as any).defaultValue.value);
  token = JSON.parse((token as any).defaultValue.value);

  var oauth2Client = new OAuth2(
    (client as any).installed.client_id,
    (client as any).installed.client_secret,
    (client as any).installed.redirect_uris[0]);

  oauth2Client.credentials = token;
  uploadVideo(oauth2Client, title);
}

async function uploadVideo(auth: any, title: string) {
  const youtube = google.youtube('v3')
  const fileSize = fs.statSync(finalFileName).size;

  const res = await youtube.videos.insert({
    auth: auth,
    part: 'status',
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title
      },
      status: {
        privacyStatus: 'unlisted'
      }
    },
    media: {
      body: fs.createReadStream(finalFileName)
    }
  }, {
    onUploadProgress: (evt: any) => {
      const progress = (evt.bytesRead / fileSize) * 100;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0, undefined);
      process.stdout.write(`${Math.round(progress)}% complete`);
    }
  });
  console.log('\n\n');
  console.log(res.data);
  return res.data;
}

/*function getNewToken(oauth2Client: any, callback: any) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload']
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code: any) {
    rl.close();
    oauth2Client.getToken(code, function(err: any, token: any) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token: any) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}*/
