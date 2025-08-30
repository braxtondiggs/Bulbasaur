import sgMail from '@sendgrid/mail';
import axios from 'axios';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getRemoteConfig } from 'firebase-admin/remote-config';
import { getStorage } from 'firebase-admin/storage';
import { onRequest } from 'firebase-functions/v2/https';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();
const remoteConfig = getRemoteConfig();

const app = express();

// Configure CORS with more specific options
app.use(
  cors({
    origin: ['https://braxtondiggs.com', 'https://www.braxtondiggs.com', /localhost:\d+$/],
    methods: ['POST'],
    credentials: true
  })
);

// Add JSON parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Instagram endpoint
app.post('/instagram', async (request: Request, response: Response) => {
  if (request.body.Url && request.body.SourceUrl) {
    const id = request.body.Url.split('/').filter(Boolean).pop();
    if (id) {
      const image = await axios.get(request.body.SourceUrl, { responseType: 'stream' });
      const contentType = image.headers['content-type'];
      const type = contentType.split('/').splice(-1).join();
      const file = storage.bucket().file(`instagram/${id}.${type}`);

      image.data
        .pipe(
          file.createWriteStream({
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
          })
        )
        .on('finish', async () => {
          const [metaData] = await file.getMetadata();

          db.doc(`instagram/${id}`)
            .set({ ...request.body, SourceUrl: metaData.mediaLink, CreatedAt: new Date() })
            .then(() => {
              response.send(request.body);
            })
            .catch(error => {
              response.status(500).send(`Error: ${error.toString()}`);
            });
        });
    }
  }
});

// Recipe search endpoint
app.post('/recipe', async (request: Request, response: Response) => {
  if (request.body.query) {
    const template = await remoteConfig.getTemplate();
    const SERPAPI = (template.parameters.SERPAPI.defaultValue as any).value;
    if (!SERPAPI) return response.json({ success: false, msg: 'invalid API token' });
    const { data } = await axios.get(
      `https://serpapi.com/search.json?q=${request.body.query}%2Crecipe&hl=en&gl=us&api_key=${SERPAPI}`
    );

    return response.send(data);
  } else {
    return response.status(500).send('Error');
  }
});

const mailValidation = [
  body('email')
    .exists()
    .withMessage('email is required')
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage('valid email required'),
  body('name').notEmpty().withMessage('name is required').trim(),
  body('message').isLength({ min: 15, max: 2056 }).withMessage('15 to 2056 characters required').trim(),
  body('subject').trim()
];

// Contact form email endpoint
app.post('/mail', mailValidation, async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  }

  const template = await remoteConfig.getTemplate();
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

// Export the function using v2 API
export const endpoints = onRequest(
  {
    cors: ['https://braxtondiggs.com', 'https://www.braxtondiggs.com', /localhost:\d+$/],
    memory: '1GiB',
    timeoutSeconds: 60,
    maxInstances: 100
  },
  app
);

// SSR function for server-side rendering
export const ssr = onRequest(
  {
    cors: true,
    memory: '2GiB',
    timeoutSeconds: 60,
    maxInstances: 100
  },
  async (req, res) => {
    try {
      const { renderApplication } = await import('@angular/platform-server');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serverModule = await import('./server/main.server.mjs' as any);
      const bootstrap = serverModule.default;
      
      // Render the Angular application
      const html = await renderApplication(bootstrap, {
        document: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Braxton Diggs - Full Stack Developer</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`,
        url: req.url || '/'
      });
      
      // Send the rendered HTML
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('SSR Error:', error);
      // Fallback to serving the static index.html
      res.redirect('/');
    }
  }
);
