const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Seed data for companies
const companiesData = [
  {
    id: 'google',
    data: {
      name: 'Google',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      website: 'https://www.google.com',
      description: 'Google is a multinational technology company that specializes in Internet-related services and products.',
      industry: 'Technology',
      location: 'Mountain View, CA'
    }
  },
  {
    id: 'microsoft',
    data: {
      name: 'Microsoft',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      website: 'https://www.microsoft.com',
      description: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.',
      industry: 'Technology',
      location: 'Redmond, WA'
    }
  }
];

// Seed data for notifications
const notificationsData = [
  {
    data: {
      userId: 'student_uid_1',
      message: 'You have been shortlisted for Google SWE role',
      type: 'status_update',
      read: false,
      timestamp: admin.firestore.Timestamp.now()
    }
  },
  {
    data: {
      userId: 'student_uid_2',
      message: 'New job posted: Microsoft Software Engineer',
      type: 'job_update',
      read: false,
      timestamp: admin.firestore.Timestamp.now()
    }
  }
];

// Seed data for placement stats
const placementStatsData = [
  {
    id: '2025',
    data: {
      year: 2025,
      totalStudents: 200,
      placedStudents: 150,
      averagePackage: '8 LPA',
      highestPackage: '30 LPA'
    }
  },
  {
    id: '2024',
    data: {
      year: 2024,
      totalStudents: 180,
      placedStudents: 140,
      averagePackage: '7 LPA',
      highestPackage: '25 LPA'
    }
  }
];

// Function to seed companies collection
async function seedCompanies() {
  console.log('Seeding companies collection...');
  
  for (const company of companiesData) {
    try {
      await db.collection('companies').doc(company.id).set(company.data);
      console.log(`✓ Added company: ${company.data.name}`);
    } catch (error) {
      console.error(`✗ Error adding company ${company.data.name}:`, error);
    }
  }
}

// Function to seed notifications collection
async function seedNotifications() {
  console.log('Seeding notifications collection...');
  
  for (const notification of notificationsData) {
    try {
      await db.collection('notifications').add(notification.data);
      console.log(`✓ Added notification for user: ${notification.data.userId}`);
    } catch (error) {
      console.error(`✗ Error adding notification for user ${notification.data.userId}:`, error);
    }
  }
}

// Function to seed placement stats collection
async function seedPlacementStats() {
  console.log('Seeding placement_stats collection...');
  
  for (const stat of placementStatsData) {
    try {
      await db.collection('placement_stats').doc(stat.id).set(stat.data);
      console.log(`✓ Added placement stats for year: ${stat.data.year}`);
    } catch (error) {
      console.error(`✗ Error adding placement stats for year ${stat.data.year}:`, error);
    }
  }
}

// Main seeding function
async function seedFirestore() {
  try {
    console.log('Starting Firestore seeding...\n');
    
    // Seed all collections
    await seedCompanies();
    console.log('');
    
    await seedNotifications();
    console.log('');
    
    await seedPlacementStats();
    console.log('');
    
    console.log('Firestore seeding completed!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seeding script
seedFirestore();
