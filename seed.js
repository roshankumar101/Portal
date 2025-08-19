const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
      },
      {
        name: "Amazon",
        logoUrl: "https://logo-url.com/amazon.png",
        website: "https://amazon.com",
        description: "E-commerce and cloud computing company.",
        industry: "Technology",
        location: "Bengaluru, India"
      },
      {
        name: "TCS",
        logoUrl: "https://logo-url.com/tcs.png",
        website: "https://tcs.com",
        description: "Indian multinational IT services and consulting company.",
        industry: "Technology",
        location: "Mumbai, India"
      },
      {
        name: "Infosys",
        logoUrl: "https://logo-url.com/infosys.png",
        website: "https://infosys.com",
        description: "Global leader in next-generation digital services and consulting.",
        industry: "Technology",
        location: "Bengaluru, India"
      },
      {
        name: "Wipro",
        logoUrl: "https://logo-url.com/wipro.png",
        website: "https://wipro.com",
        description: "Leading global information technology, consulting and business process services company.",
        industry: "Technology",
        location: "Bengaluru, India"
      }
    ];

    const companyIds = [];
    for (const company of companiesData) {
      const docRef = await db.collection('companies').add(company);
      companyIds.push(docRef.id);
      console.log(`Added company: ${company.name}`);
    }

    // Seed jobs collection
    console.log('Seeding jobs collection...');
    
    const jobsData = [
      {
        companyId: companyIds[0], // Google
        jobTitle: "Software Engineer",
        description: "Develop and maintain scalable web applications using modern technologies.",
        requirements: "Bachelor's degree in Computer Science, 2+ years experience in React/Node.js",
        salary: 1200000,
        location: "Bengaluru, India",
        jobType: "Full-time",
        experienceLevel: "Mid-level",
        skills: ["React", "Node.js", "JavaScript", "MongoDB"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        interviewDate: "2024-02-15"
      },
      {
        companyId: companyIds[1], // Microsoft
        jobTitle: "Frontend Developer",
        description: "Build responsive and interactive user interfaces for web applications.",
        requirements: "Bachelor's degree, proficiency in React, TypeScript, and modern CSS",
        salary: 1000000,
        location: "Hyderabad, India",
        jobType: "Full-time",
        experienceLevel: "Entry-level",
        skills: ["React", "TypeScript", "CSS", "HTML"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isActive: true,
        interviewDate: "2024-02-20"
      },
      {
        companyId: companyIds[2], // Amazon
        jobTitle: "Full Stack Developer",
        description: "Work on both frontend and backend development for e-commerce platforms.",
        requirements: "Bachelor's degree, experience with MERN stack, AWS knowledge preferred",
        salary: 1400000,
        location: "Bengaluru, India",
        jobType: "Full-time",
        experienceLevel: "Mid-level",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isActive: true,
        interviewDate: "2024-02-25"
      },
      {
        companyId: companyIds[3], // TCS
        jobTitle: "Software Developer",
        description: "Develop enterprise applications and work on client projects.",
        requirements: "Bachelor's degree in Engineering, good programming skills",
        salary: 600000,
        location: "Mumbai, India",
        jobType: "Full-time",
        experienceLevel: "Entry-level",
        skills: ["Java", "Spring", "SQL", "JavaScript"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        isActive: true,
        interviewDate: "2024-02-28"
      },
      {
        companyId: companyIds[4], // Infosys
        jobTitle: "System Engineer",
        description: "Work on system design and development for various client projects.",
        requirements: "Bachelor's degree, knowledge of programming languages and databases",
        salary: 550000,
        location: "Bengaluru, India",
        jobType: "Full-time",
        experienceLevel: "Entry-level",
        skills: ["Java", "Python", "SQL", "Linux"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        isActive: true,
        interviewDate: "2024-03-05"
      },
      {
        companyId: companyIds[5], // Wipro
        jobTitle: "Project Engineer",
        description: "Participate in software development lifecycle and project management.",
        requirements: "Bachelor's degree in Computer Science or related field",
        salary: 500000,
        location: "Bengaluru, India",
        jobType: "Full-time",
        experienceLevel: "Entry-level",
        skills: ["C++", "Java", "SQL", "Agile"],
        postedDate: new Date(),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
        interviewDate: "2024-03-10"
      }
    ];

    const jobIds = [];
    for (const job of jobsData) {
      const docRef = await db.collection('jobs').add(job);
      jobIds.push(docRef.id);
      console.log(`Added job: ${job.jobTitle} at ${companiesData.find(c => companyIds.indexOf(job.companyId) === companiesData.indexOf(c))?.name}`);
    }

    // Seed students collection
    console.log('Seeding students collection...');
    
    const studentsData = [
      {
        uid: "student_uid_1",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        enrollmentId: "ENR2021001",
        department: "Computer Science",
        cgpa: 8.5,
        phone: "+91-9876543210",
        address: "123 Main St, Bengaluru, Karnataka",
        dateOfBirth: "2000-05-15",
        gender: "Male",
        resumeUrl: "https://example.com/resume1.pdf",
        profilePicture: "https://example.com/profile1.jpg",
        stats: {
          applied: 5,
          shortlisted: 2,
          interviewed: 1,
          offers: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: "student_uid_2",
        name: "Priya Patel",
        email: "priya.patel@example.com",
        enrollmentId: "ENR2021002",
        department: "Information Technology",
        cgpa: 9.2,
        phone: "+91-9876543211",
        address: "456 Park Ave, Mumbai, Maharashtra",
        dateOfBirth: "2001-03-22",
        gender: "Female",
        resumeUrl: "https://example.com/resume2.pdf",
        profilePicture: "https://example.com/profile2.jpg",
        stats: {
          applied: 8,
          shortlisted: 4,
          interviewed: 2,
          offers: 1
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const student of studentsData) {
      await db.collection('students').doc(student.uid).set(student);
      console.log(`Added student: ${student.name}`);
    }

    // Seed skills collection
    console.log('Seeding skills collection...');
    
    const skillsData = [
      { studentId: "student_uid_1", skillName: "JavaScript", rating: 4, createdAt: new Date() },
      { studentId: "student_uid_1", skillName: "React", rating: 4, createdAt: new Date() },
      { studentId: "student_uid_1", skillName: "Node.js", rating: 3, createdAt: new Date() },
      { studentId: "student_uid_1", skillName: "MongoDB", rating: 3, createdAt: new Date() },
      { studentId: "student_uid_1", skillName: "Python", rating: 5, createdAt: new Date() },
      { studentId: "student_uid_1", skillName: "Java", rating: 4, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "JavaScript", rating: 5, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "React", rating: 5, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "TypeScript", rating: 4, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "CSS", rating: 4, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "HTML", rating: 5, createdAt: new Date() },
      { studentId: "student_uid_2", skillName: "Vue.js", rating: 3, createdAt: new Date() }
    ];

    for (const skill of skillsData) {
      await db.collection('skills').add(skill);
      console.log(`Added skill: ${skill.skillName} for student ${skill.studentId}`);
    }

    // Seed projects collection
    console.log('Seeding projects collection...');
    
    const projectsData = [
      {
        studentId: "student_uid_1",
        projectName: "E-Commerce Platform",
        description: "A full-stack e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Implemented responsive design and optimized for performance.",
        projectUrl: "https://github.com/rahul/ecommerce-platform",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        projectName: "Task Management System",
        description: "A collaborative task management application using React, Firebase, and Material-UI. Users can create projects, assign tasks, set deadlines, and track progress. Real-time updates and notifications keep teams synchronized.",
        projectUrl: "https://github.com/rahul/task-manager",
        technologies: ["React", "Firebase", "Material-UI"],
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        projectName: "Weather Dashboard",
        description: "Interactive weather dashboard with location-based forecasts, historical data visualization, and weather alerts. Built using React, Chart.js, and OpenWeather API. Features include dark/light themes and mobile responsiveness.",
        projectUrl: "https://github.com/rahul/weather-dashboard",
        technologies: ["React", "Chart.js", "OpenWeather API"],
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        projectName: "Social Media App",
        description: "A modern social media application with real-time messaging, post sharing, and user interactions. Built with React, Node.js, and Socket.io for real-time features.",
        projectUrl: "https://github.com/priya/social-media-app",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        projectName: "Portfolio Website",
        description: "Personal portfolio website showcasing projects, skills, and experience. Built with modern web technologies and optimized for performance and SEO.",
        projectUrl: "https://github.com/priya/portfolio",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        projectName: "Blog Platform",
        description: "A full-featured blog platform with content management, user authentication, and comment system. Supports markdown editing and has a clean, responsive design.",
        projectUrl: "https://github.com/priya/blog-platform",
        technologies: ["React", "Node.js", "PostgreSQL", "Markdown"],
        createdAt: new Date()
      }
    ];

    for (const project of projectsData) {
      await db.collection('projects').add(project);
      console.log(`Added project: ${project.projectName} for student ${project.studentId}`);
    }

    // Seed educational_background collection
    console.log('Seeding educational_background collection...');
    
    const educationData = [
      {
        studentId: "student_uid_1",
        instituteName: "ABC Engineering College",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Computer Science Engineering",
        startYear: 2021,
        endYear: 2025,
        percentage: 85.5,
        cgpa: 8.5,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        instituteName: "XYZ Higher Secondary School",
        degree: "Higher Secondary Certificate",
        fieldOfStudy: "Science",
        startYear: 2019,
        endYear: 2021,
        percentage: 92.0,
        cgpa: null,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        instituteName: "DEF Institute of Technology",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Information Technology",
        startYear: 2021,
        endYear: 2025,
        percentage: 92.0,
        cgpa: 9.2,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        instituteName: "PQR Senior Secondary School",
        degree: "Senior Secondary Certificate",
        fieldOfStudy: "Science",
        startYear: 2019,
        endYear: 2021,
        percentage: 95.5,
        cgpa: null,
        createdAt: new Date()
      }
    ];

    for (const education of educationData) {
      await db.collection('educational_background').add(education);
      console.log(`Added education: ${education.degree} for student ${education.studentId}`);
    }

    // Seed coding_profiles collection
    console.log('Seeding coding_profiles collection...');
    
    const codingProfilesData = [
      {
        studentId: "student_uid_1",
        platform: "LeetCode",
        username: "rahul_coder",
        profileUrl: "https://leetcode.com/rahul_coder",
        rating: 1850,
        problemsSolved: 450,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        platform: "GitHub",
        username: "rahul-dev",
        profileUrl: "https://github.com/rahul-dev",
        rating: null,
        problemsSolved: null,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        platform: "CodeForces",
        username: "rahul_cf",
        profileUrl: "https://codeforces.com/profile/rahul_cf",
        rating: 1650,
        problemsSolved: 200,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        platform: "LeetCode",
        username: "priya_codes",
        profileUrl: "https://leetcode.com/priya_codes",
        rating: 2100,
        problemsSolved: 650,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        platform: "GitHub",
        username: "priya-tech",
        profileUrl: "https://github.com/priya-tech",
        rating: null,
        problemsSolved: null,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        platform: "HackerRank",
        username: "priya_hr",
        profileUrl: "https://hackerrank.com/priya_hr",
        rating: 2000,
        problemsSolved: 300,
        createdAt: new Date()
      }
    ];

    for (const profile of codingProfilesData) {
      await db.collection('coding_profiles').add(profile);
      console.log(`Added coding profile: ${profile.platform} for student ${profile.studentId}`);
    }

    // Seed applications collection
    console.log('Seeding applications collection...');
    
    const applicationsData = [
      {
        studentId: "student_uid_1",
        jobId: jobIds[0], // Google Software Engineer
        companyId: companyIds[0],
        appliedDate: "2024-01-15",
        status: "applied",
        interviewDate: null,
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        jobId: jobIds[1], // Microsoft Frontend Developer
        companyId: companyIds[1],
        appliedDate: "2024-01-18",
        status: "shortlisted",
        interviewDate: "2024-02-20",
        createdAt: new Date()
      },
      {
        studentId: "student_uid_1",
        jobId: jobIds[3], // TCS Software Developer
        companyId: companyIds[3],
        appliedDate: "2024-01-20",
        status: "interviewed",
        interviewDate: "2024-02-28",
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        jobId: jobIds[0], // Google Software Engineer
        companyId: companyIds[0],
        appliedDate: "2024-01-16",
        status: "offered",
        interviewDate: "2024-02-15",
        createdAt: new Date()
      },
      {
        studentId: "student_uid_2",
        jobId: jobIds[2], // Amazon Full Stack Developer
        companyId: companyIds[2],
        appliedDate: "2024-01-22",
        status: "shortlisted",
        interviewDate: "2024-02-25",
        createdAt: new Date()
      }
    ];

    for (const application of applicationsData) {
      await db.collection('applications').add(application);
      console.log(`Added application for student ${application.studentId} to job ${application.jobId}`);
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
