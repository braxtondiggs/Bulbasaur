import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
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
  const MAILERSEND_API_KEY = (template.parameters.MAILERSEND_API_KEY.defaultValue as any)?.value;
  
  // Validate API key configuration
  if (!MAILERSEND_API_KEY || typeof MAILERSEND_API_KEY !== 'string' || MAILERSEND_API_KEY.trim() === '') {
    return response.status(500).json({ error: 'Email service configuration missing' });
  }

  const data = matchedData(request);
  const sender = `Name: ${data.name}\nEmail: ${data.email}`;

  try {
    const mailerSend = new MailerSend({
      apiKey: MAILERSEND_API_KEY.trim(),
    });

    const sentFrom = new Sender('no-reply@braxtondiggs.com', 'No-Reply');
    const recipients = [new Recipient('hello@braxtondiggs.com', 'Braxton Diggs')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(data.subject ? data.subject : 'Message from BraxtonDiggs.com')
      .setText(`${data.message}\n\n\n${sender}`);

    await mailerSend.email.send(emailParams);
    return response.json({ status: true, msg: 'Message sent successfully' });
  } catch (error: any) {
    // Log the full error for debugging but return sanitized message to client
    console.error('Email sending error:', error);
    
    // Return generic error message to avoid exposing internal details
    if (error?.response?.body?.message) {
      // MailerSend specific error handling
      return response.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
    
    return response.status(500).json({ error: 'Failed to send email. Please try again later.' });
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
