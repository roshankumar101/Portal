import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Firebase config - replace with your actual config
const firebaseConfig = {
  // Add your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Demo companies data
const companies = [
  {
    id: 'google',
    name: 'Google',
    description: 'Technology company specializing in Internet-related services and products',
    industry: 'Technology',
    location: 'Mountain View, CA',
    website: 'https://google.com',
    employees: '100000+',
    founded: 1998
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    description: 'Multinational technology corporation developing software, services, and solutions',
    industry: 'Technology',
    location: 'Redmond, WA',
    website: 'https://microsoft.com',
    employees: '200000+',
    founded: 1975
  },
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'E-commerce and cloud computing company',
    industry: 'E-commerce/Cloud',
    location: 'Seattle, WA',
    website: 'https://amazon.com',
    employees: '1500000+',
    founded: 1994
  },
  {
    id: 'apple',
    name: 'Apple',
    description: 'Technology company designing and manufacturing consumer electronics',
    industry: 'Technology',
    location: 'Cupertino, CA',
    website: 'https://apple.com',
    employees: '150000+',
    founded: 1976
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Social media and technology company',
    industry: 'Social Media',
    location: 'Menlo Park, CA',
    website: 'https://facebook.com',
    employees: '80000+',
    founded: 2004
  },
  {
    id: 'pwc',
    name: 'PwC',
    description: 'Professional services network providing audit, tax and advisory services',
    industry: 'Consulting',
    location: 'London, UK',
    website: 'https://pwc.com',
    employees: '300000+',
    founded: 1849
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    description: 'Professional services firm providing audit, consulting, tax, and advisory services',
    industry: 'Consulting',
    location: 'New York, NY',
    website: 'https://deloitte.com',
    employees: '400000+',
    founded: 1845
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Streaming entertainment service with TV series, documentaries and feature films',
    industry: 'Entertainment',
    location: 'Los Gatos, CA',
    website: 'https://netflix.com',
    employees: '12000+',
    founded: 1997
  },
  {
    id: 'tesla',
    name: 'Tesla',
    description: 'Electric vehicle and clean energy company',
    industry: 'Automotive',
    location: 'Austin, TX',
    website: 'https://tesla.com',
    employees: '120000+',
    founded: 2003
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Audio streaming and media services provider',
    industry: 'Media/Technology',
    location: 'Stockholm, Sweden',
    website: 'https://spotify.com',
    employees: '9000+',
    founded: 2006
  }
];

// Demo jobs data
const jobs = [
  {
    companyId: 'google',
    jobTitle: 'Software Engineer',
    description: 'Design, develop, test, deploy, maintain, and enhance software solutions.',
    requirements: 'Bachelor\'s degree in Computer Science or equivalent practical experience. Experience with data structures and algorithms.',
    salary: 1200000,
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['JavaScript', 'Python', 'Java', 'React'],
    postedDate: '2024-01-15',
    applicationDeadline: '2024-03-15',
    interviewDate: '2024-02-20',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.0'
  },
  {
    companyId: 'microsoft',
    jobTitle: 'Frontend Developer',
    description: 'Build responsive web applications using modern frontend technologies.',
    requirements: 'Strong knowledge of React, JavaScript, HTML, CSS. Experience with TypeScript preferred.',
    salary: 1000000,
    location: 'Hyderabad, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    postedDate: '2024-01-10',
    applicationDeadline: '2024-03-10',
    interviewDate: '2024-02-15',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 6.5'
  },
  {
    companyId: 'amazon',
    jobTitle: 'Data Analyst',
    description: 'Analyze large datasets to derive business insights and support decision making.',
    requirements: 'Bachelor\'s degree in Statistics, Mathematics, or related field. Proficiency in SQL and Python.',
    salary: 1100000,
    location: 'Mumbai, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Python', 'SQL', 'Data Analysis', 'Excel'],
    postedDate: '2024-01-12',
    applicationDeadline: '2024-03-12',
    interviewDate: '2024-02-18',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.5'
  },
  {
    companyId: 'apple',
    jobTitle: 'iOS Developer',
    description: 'Develop innovative iOS applications with focus on user experience.',
    requirements: 'Experience with Swift, iOS SDK, and Apple\'s design principles.',
    salary: 1300000,
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Swift', 'iOS', 'Xcode', 'UIKit'],
    postedDate: '2024-01-08',
    applicationDeadline: '2024-03-08',
    interviewDate: '2024-02-12',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 8.0'
  },
  {
    companyId: 'facebook',
    jobTitle: 'Product Manager',
    description: 'Drive product strategy and roadmap for social media features.',
    requirements: 'Bachelor\'s degree with strong analytical and communication skills.',
    salary: 1500000,
    location: 'Pune, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Product Management', 'Analytics', 'Communication', 'Strategy'],
    postedDate: '2024-01-20',
    applicationDeadline: '2024-03-20',
    interviewDate: '2024-02-25',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 8.5'
  },
  {
    companyId: 'pwc',
    jobTitle: 'Business Analyst',
    description: 'Analyze business processes and recommend improvements.',
    requirements: 'Strong analytical skills and knowledge of business processes.',
    salary: 800000,
    location: 'Delhi, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Business Analysis', 'Excel', 'PowerPoint', 'Process Improvement'],
    postedDate: '2024-01-18',
    applicationDeadline: '2024-03-18',
    interviewDate: '2024-02-22',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.0'
  },
  {
    companyId: 'deloitte',
    jobTitle: 'DevOps Engineer',
    description: 'Manage CI/CD pipelines and cloud infrastructure.',
    requirements: 'Experience with AWS, Docker, Kubernetes, and automation tools.',
    salary: 1300000,
    location: 'Chennai, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
    postedDate: '2024-01-14',
    applicationDeadline: '2024-03-14',
    interviewDate: '2024-02-19',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.5'
  },
  {
    companyId: 'netflix',
    jobTitle: 'UI/UX Designer',
    description: 'Design user interfaces and experiences for streaming platform.',
    requirements: 'Portfolio demonstrating UI/UX design skills and proficiency in design tools.',
    salary: 900000,
    location: 'Gurgaon, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['UI Design', 'UX Design', 'Figma', 'Adobe Creative Suite'],
    postedDate: '2024-01-16',
    applicationDeadline: '2024-03-16',
    interviewDate: '2024-02-21',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 6.0'
  },
  {
    companyId: 'tesla',
    jobTitle: 'Mechanical Engineer',
    description: 'Design and develop automotive components and systems.',
    requirements: 'Bachelor\'s degree in Mechanical Engineering with CAD experience.',
    salary: 1100000,
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Mechanical Design', 'CAD', 'SolidWorks', 'AutoCAD'],
    postedDate: '2024-01-22',
    applicationDeadline: '2024-03-22',
    interviewDate: '2024-02-27',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.0'
  },
  {
    companyId: 'spotify',
    jobTitle: 'Backend Developer',
    description: 'Build scalable backend services for music streaming platform.',
    requirements: 'Experience with Node.js, databases, and API development.',
    salary: 1000000,
    location: 'Mumbai, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Node.js', 'MongoDB', 'REST APIs', 'Microservices'],
    postedDate: '2024-01-25',
    applicationDeadline: '2024-03-25',
    interviewDate: '2024-03-01',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.5'
  },
  {
    companyId: 'google',
    jobTitle: 'Machine Learning Engineer',
    description: 'Develop and deploy machine learning models at scale.',
    requirements: 'Strong background in ML algorithms, Python, and TensorFlow/PyTorch.',
    salary: 1400000,
    location: 'Bangalore, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
    postedDate: '2024-01-28',
    applicationDeadline: '2024-03-28',
    interviewDate: '2024-03-05',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 8.0'
  },
  {
    companyId: 'microsoft',
    jobTitle: 'Cloud Solutions Architect',
    description: 'Design and implement cloud solutions using Azure services.',
    requirements: 'Knowledge of cloud platforms, architecture patterns, and enterprise solutions.',
    salary: 1350000,
    location: 'Hyderabad, India',
    jobType: 'Full-time',
    experienceLevel: 'Entry Level',
    skills: ['Azure', 'Cloud Architecture', 'Microservices', 'DevOps'],
    postedDate: '2024-01-30',
    applicationDeadline: '2024-03-30',
    interviewDate: '2024-03-07',
    isActive: true,
    eligibilityCriteria: 'CGPA >= 7.5'
  }
];

async function createDemoData() {
  try {
    console.log('Creating demo companies...');
    
    // Create companies
    for (const company of companies) {
      await setDoc(doc(db, 'companies', company.id), company);
      console.log(`Created company: ${company.name}`);
    }
    
    console.log('Creating demo jobs...');
    
    // Create jobs
    for (const job of jobs) {
      const jobRef = await addDoc(collection(db, 'jobs'), {
        ...job,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created job: ${job.jobTitle} at ${job.companyId} with ID: ${jobRef.id}`);
    }
    
    console.log('Demo data creation completed!');
    
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
}

// Run the function
createDemoData();
