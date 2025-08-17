import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and place it in the project root as 'firebase-service-account.json'
const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'placement-portal-e11ab'
});

const db = admin.firestore();

async function seedFirestore() {
  try {
    console.log('Starting Firestore seeding...');

    // Seed companies collection
    console.log('Seeding companies collection...');
    
    const companiesData = [
      {
        name: "Google",
        logoUrl: "https://logo-url.com/google.png",
        website: "https://google.com",
        description: "Global technology company specializing in search, cloud, and AI.",
        industry: "Technology",
        location: "Bengaluru, India"
      },
      {
        name: "Microsoft",
        logoUrl: "https://logo-url.com/microsoft.png",
        website: "https://microsoft.com",
        description: "Technology company developing software, cloud services, and hardware.",
        industry: "Technology",
        location: "Hyderabad, India"
      }
    ];

    for (const company of companiesData) {
      await db.collection('companies').add(company);
      console.log(`Added company: ${company.name}`);
    }

    // Seed notifications collection
    console.log('Seeding notifications collection...');
    
    const notificationsData = [
      {
        userId: "student_uid_1",
        message: "You have been shortlisted for Google SWE role",
        type: "status_update",
        read: false,
        timestamp: new Date()
      },
      {
        userId: "student_uid_2",
        message: "New job posted: Microsoft Software Engineer",
        type: "job_update",
        read: false,
        timestamp: new Date()
      }
    ];

    for (const notification of notificationsData) {
      await db.collection('notifications').add(notification);
      console.log(`Added notification for user: ${notification.userId}`);
    }

    // Seed placement_stats collection
    console.log('Seeding placement_stats collection...');
    
    const placementStatsData = [
      {
        docId: "2025",
        data: {
          year: 2025,
          totalStudents: 200,
          placedStudents: 150,
          averagePackage: "8 LPA",
          highestPackage: "30 LPA"
        }
      },
      {
        docId: "2024",
        data: {
          year: 2024,
          totalStudents: 180,
          placedStudents: 140,
          averagePackage: "7 LPA",
          highestPackage: "25 LPA"
        }
      }
    ];

    for (const stat of placementStatsData) {
      await db.collection('placement_stats').doc(stat.docId).set(stat.data);
      console.log(`Added placement stats for year: ${stat.data.year}`);
    }

    console.log('Firestore seeding completed!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedFirestore();
