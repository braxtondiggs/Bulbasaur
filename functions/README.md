# Functions

Backend API for BraxtonDiggs.com portfolio site.

## What's here

This directory contains Firebase Cloud Functions that handle:
- Contact form submissions (sends emails via MailerSend)
- Instagram media processing and storage
- Recipe search functionality

Built with Firebase Functions v6, Node 20, and TypeScript.

## Endpoints

- `POST /mail` - Handles contact form, sends email
- `POST /instagram` - Processes Instagram posts for storage
- `POST /recipe` - Search recipes using SERP API

## Development

You'll need Node 20+ and Firebase CLI installed.

```bash
npm install -g firebase-tools
npm install
```

### Commands

```bash
npm run build          # Compile TypeScript
npm run build:watch    # Watch for changes
npm run lint           # Fix code style
npm run serve          # Start local emulator
npm run serve:watch    # Start emulator + watch (best for dev)
npm run deploy         # Deploy to production
npm run logs           # View function logs
```

### Working locally

Start the functions emulator:
```bash
npm run serve:watch
```

Then start the main site from the parent directory:
```bash
cd .. && npm start
```

The Angular app automatically connects to the local emulator when running in dev mode.

## Configuration

Set these up in Firebase Remote Config:
- `MAILERSEND_API_KEY` - for sending contact emails
- `SERPAPI` - for recipe search functionality

CORS is configured for braxtondiggs.com and localhost development.

## Deployment

```bash
npm run deploy
```

This compiles TypeScript, runs linting, and deploys to Firebase.

## Troubleshooting

**Build issues?** Try `npm run build` to see TypeScript errors.

**Linting errors?** Run `npm run lint` to auto-fix most issues.

**Local emulator not working?** Make sure it's running on port 5001.

**Need logs?** Use `npm run logs` or check the Firebase console.