import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();
const db = admin.firestore();

const app = express();
const config = admin.remoteConfig();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/instagram', async (request: functions.Request, response: functions.Response) => {
  if (request.body['Url'] && request.body['SourceUrl']) {
    const id = request.body['Url'].split('/').filter(Boolean).pop();
    if (id) {
      const image = await axios.get(request.body['SourceUrl'], { responseType: 'stream' });
      const contentType = image.headers['content-type'];
      const type = contentType.split('/').splice(-1).join();
      const file = admin.storage().bucket().file(`instagram/${id}.${type}`);

      image.data.pipe(file.createWriteStream({
        resumable: false,
        validation: false,
        contentType: 'auto',
        public: true,
        metadata: {
          'Cache-Control': 'public, max-age=31536000',
          metadata: {
            firebaseStorageDownloadTokens: uuidv4()
          }
        }
      })).on('finish', async () => {
        const [metaData] = await file.getMetadata();

        db.doc(`instagram/${id}`).set({ ...request.body, SourceUrl: metaData.mediaLink, CreatedAt: new Date() }).then(() => {
          response.send(request.body);
        }).catch((error) => {
          response.status(500).send(`Error: ${error.toString()}`);
        });
      });

    }
  }
});

app.post('/recipe', async (request: functions.Request, response: functions.Response) => {
  if (request.body['query']) {
    const template = await config.getTemplate()
    const SERPAPI = (template.parameters.SERPAPI.defaultValue as any).value;
    if (!SERPAPI) return response.json({ success: false, msg: 'invalid API token' });
    const { data } = await axios.get(`https://serpapi.com/search.json?q=${request.body['query']}%2Crecipe&hl=en&gl=us&api_key=${SERPAPI}`);

    return response.send(data);
  } else {
    return response.status(500).send('Error');
  }
});

exports.endpoints = functions.https.onRequest(app);
