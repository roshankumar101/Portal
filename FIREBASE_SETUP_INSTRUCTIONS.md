# Firebase Setup Instructions

## 🔥 **CRITICAL: Apply These Fixes to Resolve Console Errors**

### **1. Deploy Firestore Security Rules**

1. Open Firebase Console: https://console.firebase.google.com
2. Select your Portal project
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

### **2. Create Required Firestore Indexes**

**Option A: Use Firebase Console Link (Recommended)**
- Click this link from your console error: 
  ```
  https://console.firebase.google.com/v1/r/project/YOUR_PROJECT_ID/firestore/indexes?create_composite=...
  ```

**Option B: Manual Creation**
1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index**
3. Create composite index for `applications` collection:
   - Collection ID: `applications`
   - Field 1: `studentId` (Ascending)
   - Field 2: `appliedDate` (Descending)

**Option C: Use Firebase CLI**
```bash
firebase deploy --only firestore:indexes
```

### **3. Verify Environment Variables**

Ensure your `.env` file contains:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **4. Test the Fixes**

After applying the above:
1. Restart your development server: `npm run dev`
2. Login to student dashboard
3. Check browser console - errors should be resolved

## **What Was Fixed**

✅ **SVG DOM Properties**: Fixed `stroke-width` → `strokeWidth` in DashboardLayout.jsx
✅ **Firestore Rules**: Created proper permissions for all collections
✅ **Database Indexes**: Defined required composite indexes
✅ **Security**: Role-based access control implemented

## **Expected Results**

- No more React DOM property warnings
- Student profile data loads successfully
- Jobs and applications fetch without permission errors
- Clean console with no Firebase errors
