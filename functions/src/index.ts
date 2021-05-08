import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';

admin.initializeApp();
const db = admin.firestore();

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post('/instagram', (request: functions.Request, response: functions.Response) => {
  if (request.body['Url'] && request.body['SourceUrl']) {
    const id = request.body['Url'].split('/').filter(Boolean).pop();
    if (id) {
      db.doc(`instagram/${id}`).set({ ...request.body, CreatedAt: new Date() }).then(() => {
        response.send(request.body);
      }).catch((error) => {
        response.status(500).send(`Error: ${error.toString()}`);
      });
    }
  }
});

exports.endpoints = functions.https.onRequest(app);