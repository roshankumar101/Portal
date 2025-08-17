# Firebase Database Structure for Portal

## Required Collections

### 1. `users` Collection
Each document should have the user's UID as the document ID.

**Document Structure:**
```json
{
  "email": "student@example.com",
  "role": "student", // "student" | "recruiter" | "admin"
  "displayName": "John Doe",
  "photoURL": "https://...",
  "createdAt": "2025-01-16T00:00:00Z",
  "profile": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "school": "School of Technology",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "bio": "Passionate software developer"
  },
  "recruiterVerified": false // only for recruiters
}
```

### 2. `jobs` Collection (Optional - for job postings)
```json
{
  "title": "Software Engineer",
  "company": "TechCorp",
  "description": "Job description...",
  "requirements": ["JavaScript", "React"],
  "salary": "₹8-12 LPA",
  "location": "Bangalore",
  "type": "Full-time",
  "status": "open",
  "recruiterId": "recruiter-uid",
  "createdAt": "2025-01-16T00:00:00Z",
  "updatedAt": "2025-01-16T00:00:00Z"
}
```

### 3. `applications` Collection (Optional - for job applications)
```json
{
  "jobId": "job-document-id",
  "studentId": "student-uid",
  "status": "applied", // "applied" | "reviewed" | "interview" | "rejected" | "accepted"
  "appliedAt": "2025-01-16T00:00:00Z",
  "resume": "https://storage.url/resume.pdf",
  "coverLetter": "Cover letter text..."
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all users
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Admins can update user roles
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Jobs - recruiters can create/edit their own, everyone can read
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        request.auth.uid == resource.data.recruiterId;
    }
    
    // Applications - students can create their own, recruiters can read applications for their jobs
    match /applications/{applicationId} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.studentId;
      allow read, update: if request.auth != null && 
        (request.auth.uid == resource.data.studentId ||
         request.auth.uid == get(/databases/$(database)/documents/jobs/$(resource.data.jobId)).data.recruiterId);
    }
  }
}
```
