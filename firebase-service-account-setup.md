# Firebase Service Account Setup

To run the seed script, you need to download your Firebase service account key:

## Steps:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `placement-portal-e11ab`
3. **Go to Project Settings** (gear icon → Project settings)
4. **Click "Service accounts" tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**
7. **Rename it to**: `firebase-service-account.json`
8. **Place it in your project root** (same folder as package.json)

## Important Security Note:
- Add `firebase-service-account.json` to your `.gitignore` file
- Never commit this file to version control
- This file contains sensitive credentials

## Run the seed script:
```bash
npm install firebase-admin
npm run seed
```
