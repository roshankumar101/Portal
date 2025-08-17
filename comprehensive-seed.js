import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'placement-portal-e11ab'
});

const db = admin.firestore();

async function seedFirestore() {
  try {
    console.log('Starting comprehensive Firestore seeding...');

    // Seed companies collection
    console.log('Seeding companies collection...');
    
    const companiesData = [
      {
        name: "Google",
        logoUrl: "https://logo.clearbit.com/google.com",
        website: "https://google.com",
        description: "Global technology company specializing in search, cloud, and AI.",
        industry: "Technology",
        location: "Bengaluru, India"
      },
      {
        name: "Microsoft",
        logoUrl: "https://logo.clearbit.com/microsoft.com",
        website: "https://microsoft.com",
        description: "Technology company developing software, cloud services, and hardware.",
        industry: "Technology",
        location: "Hyderabad, India"
      },
      {
        name: "TechCorp",
        logoUrl: "https://via.placeholder.com/100x100/4285f4/ffffff?text=TC",
        website: "https://techcorp.com",
        description: "Innovative technology solutions provider.",
        industry: "Technology",
        location: "Mumbai, India"
      },
      {
        name: "InnovateX",
        logoUrl: "https://via.placeholder.com/100x100/34a853/ffffff?text=IX",
        website: "https://innovatex.com",
        description: "Data analytics and AI solutions company.",
        industry: "Technology",
        location: "Pune, India"
      },
      {
        name: "WebSolutions",
        logoUrl: "https://via.placeholder.com/100x100/ea4335/ffffff?text=WS",
        website: "https://websolutions.com",
        description: "Full-stack web development company.",
        industry: "Technology",
        location: "Chennai, India"
      }
    ];

    const companyRefs = {};
    for (const company of companiesData) {
      const docRef = await db.collection('companies').add(company);
      companyRefs[company.name] = docRef.id;
      console.log(`Added company: ${company.name}`);
    }

    // Seed students collection
    console.log('Seeding students collection...');
    
    const studentsData = [
      {
        uid: "student_uid_1",
        personalInfo: {
          name: "Niraj Roy",
          email: "niraj.roy.sot2428@gmail.com",
          phone: "8603231644",
          linkedinUrl: "https://linkedin.com/in/nirajroy"
        },
        stats: {
          applied: 3,
          shortlisted: 1,
          interviewed: 0,
          offers: 0
        }
      },
      {
        uid: "student_uid_2",
        personalInfo: {
          name: "Priya Sharma",
          email: "priya.sharma@example.com",
          phone: "9876543210",
          linkedinUrl: "https://linkedin.com/in/priyasharma"
        },
        stats: {
          applied: 5,
          shortlisted: 2,
          interviewed: 1,
          offers: 1
        }
      }
    ];

    for (const student of studentsData) {
      await db.collection('students').doc(student.uid).set(student);
      console.log(`Added student: ${student.personalInfo.name}`);
    }

    // Seed educational_background collection
    console.log('Seeding educational_background collection...');
    
    const educationData = [
      {
        studentId: "student_uid_1",
        institute: "PW IOI",
        yearOfPassing: 2028,
        percentage: 8.97,
        degree: "B.Tech Computer Science"
      },
      {
        studentId: "student_uid_2",
        institute: "IIT Delhi",
        yearOfPassing: 2025,
        percentage: 9.2,
        degree: "B.Tech Information Technology"
      }
    ];

    for (const education of educationData) {
      await db.collection('educational_background').add(education);
      console.log(`Added education for student: ${education.studentId}`);
    }

    // Seed skills collection
    console.log('Seeding skills collection...');
    
    const skillsData = [
      { studentId: "student_uid_1", skillName: "JavaScript", rating: 4 },
      { studentId: "student_uid_1", skillName: "React", rating: 4 },
      { studentId: "student_uid_1", skillName: "Node.js", rating: 3 },
      { studentId: "student_uid_1", skillName: "Python", rating: 3 },
      { studentId: "student_uid_2", skillName: "Java", rating: 5 },
      { studentId: "student_uid_2", skillName: "Spring Boot", rating: 4 },
      { studentId: "student_uid_2", skillName: "MySQL", rating: 4 },
      { studentId: "student_uid_2", skillName: "AWS", rating: 3 }
    ];

    for (const skill of skillsData) {
      await db.collection('skills').add(skill);
      console.log(`Added skill: ${skill.skillName} for ${skill.studentId}`);
    }

    // Seed projects collection
    console.log('Seeding projects collection...');
    
    const projectsData = [
      {
        studentId: "student_uid_1",
        projectName: "E-commerce Platform",
        description: "Full-stack e-commerce application built with React and Node.js",
        projectUrl: "https://github.com/nirajroy/ecommerce-platform"
      },
      {
        studentId: "student_uid_1",
        projectName: "Task Management App",
        description: "React-based task management application with real-time updates",
        projectUrl: "https://github.com/nirajroy/task-manager"
      },
      {
        studentId: "student_uid_2",
        projectName: "Social Media Analytics",
        description: "Java Spring Boot application for social media data analysis",
        projectUrl: "https://github.com/priyasharma/social-analytics"
      },
      {
        studentId: "student_uid_2",
        projectName: "Banking System",
        description: "Secure banking application with microservices architecture",
        projectUrl: "https://github.com/priyasharma/banking-system"
      }
    ];

    for (const project of projectsData) {
      await db.collection('projects').add(project);
      console.log(`Added project: ${project.projectName} for ${project.studentId}`);
    }

    // Seed coding_profiles collection
    console.log('Seeding coding_profiles collection...');
    
    const codingProfilesData = [
      { studentId: "student_uid_1", platform: "leetcode", profileUrl: "https://leetcode.com/nirajroy", username: "nirajroy" },
      { studentId: "student_uid_1", platform: "codeforces", profileUrl: "https://codeforces.com/profile/nirajroy", username: "nirajroy" },
      { studentId: "student_uid_1", platform: "github", profileUrl: "https://github.com/nirajroy", username: "nirajroy" },
      { studentId: "student_uid_2", platform: "leetcode", profileUrl: "https://leetcode.com/priyasharma", username: "priyasharma" },
      { studentId: "student_uid_2", platform: "hackerrank", profileUrl: "https://hackerrank.com/priyasharma", username: "priyasharma" },
      { studentId: "student_uid_2", platform: "github", profileUrl: "https://github.com/priyasharma", username: "priyasharma" }
    ];

    for (const profile of codingProfilesData) {
      await db.collection('coding_profiles').add(profile);
      console.log(`Added ${profile.platform} profile for ${profile.studentId}`);
    }

    // Seed jobs collection
    console.log('Seeding jobs collection...');
    
    const jobsData = [
      {
        companyId: companyRefs["Google"],
        jobTitle: "Software Engineer",
        salary: 1200000,
        interviewDate: "2025-04-15",
        description: "Join Google as a Software Engineer and work on cutting-edge technologies.",
        requirements: ["JavaScript", "React", "Node.js", "System Design"],
        isActive: true,
        postedDate: "2025-03-01",
        jdUrl: "https://careers.google.com/jobs/results/123456789"
      },
      {
        companyId: companyRefs["Microsoft"],
        jobTitle: "Full Stack Developer",
        salary: 1000000,
        interviewDate: "2025-04-20",
        description: "Build scalable web applications at Microsoft.",
        requirements: ["C#", ".NET", "Azure", "React"],
        isActive: true,
        postedDate: "2025-03-05",
        jdUrl: "https://careers.microsoft.com/jobs/results/987654321"
      },
      {
        companyId: companyRefs["TechCorp"],
        jobTitle: "Software Engineer",
        salary: 800000,
        interviewDate: "2025-04-10",
        description: "Work on innovative tech solutions at TechCorp.",
        requirements: ["Java", "Spring Boot", "MySQL"],
        isActive: true,
        postedDate: "2025-02-28",
        jdUrl: "https://techcorp.com/careers/swe-2025"
      },
      {
        companyId: companyRefs["InnovateX"],
        jobTitle: "Data Analyst",
        salary: 700000,
        interviewDate: "2025-04-25",
        description: "Analyze data and build insights at InnovateX.",
        requirements: ["Python", "SQL", "Tableau", "Statistics"],
        isActive: true,
        postedDate: "2025-03-10",
        jdUrl: "https://innovatex.com/jobs/data-analyst"
      },
      {
        companyId: companyRefs["WebSolutions"],
        jobTitle: "Frontend Developer",
        salary: 600000,
        interviewDate: "2025-04-12",
        description: "Create beautiful user interfaces at WebSolutions.",
        requirements: ["React", "TypeScript", "CSS", "UI/UX"],
        isActive: true,
        postedDate: "2025-03-08",
        jdUrl: "https://websolutions.com/careers/frontend-dev"
      }
    ];

    const jobRefs = {};
    for (const job of jobsData) {
      const docRef = await db.collection('jobs').add(job);
      jobRefs[job.jobTitle + "_" + job.companyId] = docRef.id;
      console.log(`Added job: ${job.jobTitle} at company ID: ${job.companyId}`);
    }

    // Seed applications collection
    console.log('Seeding applications collection...');
    
    const applicationsData = [
      {
        studentId: "student_uid_1",
        jobId: jobRefs["Software Engineer_" + companyRefs["TechCorp"]],
        companyId: companyRefs["TechCorp"],
        appliedDate: "2024-04-01",
        status: "applied",
        interviewDate: null
      },
      {
        studentId: "student_uid_1",
        jobId: jobRefs["Data Analyst_" + companyRefs["InnovateX"]],
        companyId: companyRefs["InnovateX"],
        appliedDate: "2024-03-20",
        status: "shortlisted",
        interviewDate: "2025-04-25"
      },
      {
        studentId: "student_uid_1",
        jobId: jobRefs["Frontend Developer_" + companyRefs["WebSolutions"]],
        companyId: companyRefs["WebSolutions"],
        appliedDate: "2024-02-05",
        status: "rejected",
        interviewDate: null
      },
      {
        studentId: "student_uid_2",
        jobId: jobRefs["Software Engineer_" + companyRefs["Google"]],
        companyId: companyRefs["Google"],
        appliedDate: "2024-03-15",
        status: "offered",
        interviewDate: "2025-04-15"
      },
      {
        studentId: "student_uid_2",
        jobId: jobRefs["Full Stack Developer_" + companyRefs["Microsoft"]],
        companyId: companyRefs["Microsoft"],
        appliedDate: "2024-03-18",
        status: "interviewed",
        interviewDate: "2025-04-20"
      }
    ];

    for (const application of applicationsData) {
      await db.collection('applications').add(application);
      console.log(`Added application: ${application.studentId} -> ${application.status}`);
    }

    // Seed notifications collection
    console.log('Seeding notifications collection...');
    
    const notificationsData = [
      {
        userId: "student_uid_1",
        message: "You have been shortlisted for InnovateX Data Analyst role",
        type: "status_update",
        read: false,
        timestamp: new Date()
      },
      {
        userId: "student_uid_2",
        message: "Congratulations! You have an offer from Google",
        type: "status_update",
        read: false,
        timestamp: new Date()
      },
      {
        userId: "student_uid_1",
        message: "New job posted: Microsoft Full Stack Developer",
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

    console.log('✅ Comprehensive Firestore seeding completed successfully!');
    console.log('\n📊 Collections created:');
    console.log('- companies (5 records)');
    console.log('- students (2 records)');
    console.log('- educational_background (2 records)');
    console.log('- skills (8 records)');
    console.log('- projects (4 records)');
    console.log('- coding_profiles (6 records)');
    console.log('- jobs (5 records)');
    console.log('- applications (5 records)');
    console.log('- notifications (3 records)');
    console.log('- placement_stats (2 records)');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedFirestore();
