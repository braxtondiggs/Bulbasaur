import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { body, matchedData, validationResult } from 'express-validator';

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

const mailValidation = [
  body('email').exists().withMessage('email is required').isEmail().trim().normalizeEmail().withMessage('valid email required'),
  body('name').notEmpty().withMessage('name is required').trim(),
  body('message').isLength({ min: 15, max: 2056 }).withMessage('15 to 2056 characters required').trim(),
  body('subject').trim()
];

app.post('/mail', mailValidation, async (request: functions.Request, response: functions.Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  }

  const template = await config.getTemplate();
  const SENDGRID_API_KEY = (template.parameters.SENDGRID_API_KEY.defaultValue as any).value;
  const data = matchedData(request);
  const sender = `Name: ${data.name}\nEmail: ${data.email}`;

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send({
      from: {
        email: 'no-reply@braxtondiggs.com',
        name: 'No-Reply'
      },
      subject: data.subject ? data.subject : 'Message from BraxtonDiggs.com',
      text: `${data.message}\n\n\n${sender}`,
      to: {
        email: 'hello@braxtondiggs.com',
        name: 'Braxton Diggs'
      }
    });
    return response.json({ status: true, msg: 'Message sent successfully' });
  } catch (error: any) {
    return response.status(500).json({ error: error.toString() });
  }
});

exports.endpoints = functions.https.onRequest(app);
