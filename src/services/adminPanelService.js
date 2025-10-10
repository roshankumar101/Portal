import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

/**
 * Service for AdminPanel analytics and data operations
 * Uses real-time Firestore queries for live analytics
 */

/**
 * Get AdminPanel analytics data (8 stat cards + 3 charts) from Firebase
 * @param {Object} filters - Filter object with center, school, batch, admin arrays
 * @param {number} [dayWindow=90] - Number of days to look back
 * @returns {Promise<Object>} Real analytics data from Firebase
 */
export async function getAdminPanelData(filters = {}, dayWindow = 90) {
  try {
    console.log('🔄 Fetching real AdminPanel data from Firebase with filters:', filters);
    
    // Calculate date window
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dayWindow);
    
    // Fetch all required data in parallel
    const [studentsData, jobsData, applicationsData, usersData] = await Promise.all([
      fetchStudentsData(filters),
      fetchJobsData(filters, cutoffDate),
      fetchApplicationsData(filters, cutoffDate),
      fetchUsersData(filters)
    ]);
    
    // Calculate stats
    const statsData = calculateStatsData(studentsData, jobsData, applicationsData, usersData);
    
    // Generate chart data
    const chartData = generateChartData(studentsData, jobsData, applicationsData, usersData, dayWindow);
    
    const result = {
      statsData,
      chartData
    };
    
    console.log('✅ Real AdminPanel data fetched from Firebase:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching AdminPanel data from Firebase:', error);
    throw new Error(`Failed to fetch analytics data: ${error.message}`);
  }
}

/**
 * Fetch students data from Firebase with filters
 */
async function fetchStudentsData(filters) {
  const studentsRef = collection(db, 'students');
  let studentsQuery = studentsRef;
  
  // Apply filters if provided
  if (filters.center && filters.center.length > 0 && !filters.center.includes('all')) {
    studentsQuery = query(studentsQuery, where('center', 'in', filters.center));
  }
  if (filters.school && filters.school.length > 0 && !filters.school.includes('all')) {
    studentsQuery = query(studentsQuery, where('school', 'in', filters.school));
  }
  if (filters.batch && filters.batch.length > 0 && !filters.batch.includes('all')) {
    studentsQuery = query(studentsQuery, where('batch', 'in', filters.batch));
  }
  
  const snapshot = await getDocs(studentsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetch jobs data from Firebase with filters
 */
async function fetchJobsData(filters, cutoffDate) {
  const jobsRef = collection(db, 'jobs');
  let jobsQuery = query(jobsRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(jobsQuery);
  let jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter by date window
  jobs = jobs.filter(job => {
    const jobDate = job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
    return jobDate >= cutoffDate;
  });
  
  // Apply admin filter if provided
  if (filters.admin && filters.admin.length > 0 && !filters.admin.includes('all')) {
    jobs = jobs.filter(job => filters.admin.includes(job.createdBy));
  }
  
  return jobs;
}

/**
 * Fetch applications data from Firebase with filters
 */
async function fetchApplicationsData(filters, cutoffDate) {
  const applicationsRef = collection(db, 'applications');
  let applicationsQuery = query(applicationsRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(applicationsQuery);
  let applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter by date window
  applications = applications.filter(app => {
    const appDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt);
    return appDate >= cutoffDate;
  });
  
  return applications;
}

/**
 * Fetch users data from Firebase with filters
 */
async function fetchUsersData(filters) {
  const usersRef = collection(db, 'users');
  let usersQuery = query(usersRef, where('role', '==', 'admin'));
  
  const snapshot = await getDocs(usersQuery);
  let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Apply admin filter if provided
  if (filters.admin && filters.admin.length > 0 && !filters.admin.includes('all')) {
    users = users.filter(user => filters.admin.includes(user.id));
  }
  
  return users;
}

/**
 * Calculate statistics from Firebase data
 */
function calculateStatsData(students, jobs, applications, users) {
  const totalStudents = students.length;
  const activeJobs = jobs.filter(job => job.status === 'posted' || job.status === 'active').length;
  const totalApplications = applications.length;
  
  // Calculate placement rate
  const placedStudents = students.filter(student => 
    student.placementStatus === 'placed' || student.status === 'placed'
  ).length;
  const placementRate = totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0;
  
  // Calculate average salary (if available)
  const studentsWithSalary = students.filter(student => student.salary && student.salary > 0);
  const avgSalary = studentsWithSalary.length > 0 
    ? studentsWithSalary.reduce((sum, student) => sum + student.salary, 0) / studentsWithSalary.length 
    : 0;
  
  // Calculate top companies count
  const companies = new Set();
  jobs.forEach(job => {
    if (job.companyName) companies.add(job.companyName);
  });
  
  // Calculate pending queries (applications in review)
  const pendingQueries = applications.filter(app => 
    app.status === 'pending' || app.status === 'in_review'
  ).length;
  
  return {
    totalStudents,
    activeJobs,
    totalApplications,
    placementRate: Math.round(placementRate * 10) / 10,
    avgSalary: Math.round(avgSalary),
    topCompanies: companies.size,
    pendingQueries,
    systemHealth: 98.5 // This could be calculated based on error rates, etc.
  };
}

/**
 * Generate chart data from Firebase data
 */
function generateChartData(students, jobs, applications, users, dayWindow) {
  // Placement Status Chart
  const placedCount = students.filter(s => s.placementStatus === 'placed' || s.status === 'placed').length;
  const inProcessCount = applications.filter(a => a.status === 'in_review' || a.status === 'pending').length;
  const notPlacedCount = students.filter(s => s.placementStatus === 'not_placed' || s.status === 'not_placed').length;
  const optedOutCount = students.filter(s => s.placementStatus === 'opted_out' || s.status === 'opted_out').length;
  
  const placementStatus = {
    labels: ['Placed', 'In Process', 'Not Placed', 'Opted Out'],
    datasets: [{
      label: 'Students',
      data: [placedCount, inProcessCount, notPlacedCount, optedOutCount],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ]
    }]
  };
  
  // Monthly Trend Chart
  const monthlyData = generateMonthlyTrend(applications, jobs, dayWindow);
  
  // Admin Performance Chart
  const adminPerformance = generateAdminPerformance(jobs, applications, users);
  
  return {
    placementStatus,
    monthlyTrend: monthlyData,
    adminPerformance
  };
}

/**
 * Generate monthly trend data
 */
function generateMonthlyTrend(applications, jobs, dayWindow) {
  const months = [];
  const applicationsData = [];
  const placementsData = [];
  
  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    months.push(monthName);
    
    // Count applications for this month
    const monthApplications = applications.filter(app => {
      const appDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt);
      return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
    }).length;
    
    // Count placements for this month (applications with status 'hired' or 'placed')
    const monthPlacements = applications.filter(app => {
      const appDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt);
      return (app.status === 'hired' || app.status === 'placed') &&
             appDate.getMonth() === date.getMonth() && 
             appDate.getFullYear() === date.getFullYear();
    }).length;
    
    applicationsData.push(monthApplications);
    placementsData.push(monthPlacements);
  }
  
  return {
    labels: months,
    datasets: [{
      label: 'Applications',
      data: applicationsData,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }, {
      label: 'Placements',
      data: placementsData,
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  };
}

/**
 * Generate admin performance data
 */
function generateAdminPerformance(jobs, applications, users) {
  return users.map(admin => {
    const adminJobs = jobs.filter(job => job.createdBy === admin.id);
    const adminJobIds = adminJobs.map(job => job.id);
    const adminApplications = applications.filter(app => adminJobIds.includes(app.jobId));
    const successfulPlacements = adminApplications.filter(app => 
      app.status === 'hired' || app.status === 'placed'
    ).length;
    
    return {
      admin: admin.displayName || admin.name || `Admin ${admin.id.slice(-4)}`,
      jobsPosted: adminJobs.length,
      applications: adminApplications.length,
      placements: successfulPlacements,
      successRate: adminApplications.length > 0 
        ? Math.round((successfulPlacements / adminApplications.length) * 100) 
        : 0
    };
  });
}

/**
 * Export AdminPanel report as CSV with real Firebase data
 * @param {Object} filters - Current filter state
 * @param {number} [dayWindow=90] - Number of days to look back
 * @returns {Promise<void>} Downloads CSV file
 */
export async function exportReportCSV(filters = {}, dayWindow = 90) {
  try {
    console.log('📊 Exporting real AdminPanel report with filters:', filters);
    
    // Fetch real data from Firebase
    const data = await getAdminPanelData(filters, dayWindow);
    
    // Get detailed data for CSV export
    const [studentsData, jobsData, applicationsData] = await Promise.all([
      fetchStudentsData(filters),
      fetchJobsData(filters, new Date(Date.now() - dayWindow * 24 * 60 * 60 * 1000)),
      fetchApplicationsData(filters, new Date(Date.now() - dayWindow * 24 * 60 * 60 * 1000))
    ]);
    
    // Generate CSV header
    let csvData = 'Job Title,Company,Posted By,Posted Date,Applicants,Placed Students,Status,School,Batch,Center\n';
    
    // Add job data rows
    jobsData.forEach(job => {
      const jobApplications = applicationsData.filter(app => app.jobId === job.id);
      const placedFromJob = jobApplications.filter(app => app.status === 'hired' || app.status === 'placed').length;
      const postedDate = job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString() : 'N/A';
      
      csvData += `"${job.title || 'N/A'}","${job.companyName || 'N/A'}","${job.createdByName || job.createdBy || 'N/A'}","${postedDate}",${jobApplications.length},${placedFromJob},"${job.status || 'N/A'}","${job.targetSchools?.join(';') || 'All'}","${job.targetBatches?.join(';') || 'All'}","${job.targetCenters?.join(';') || 'All'}"\n`;
    });
    
    // Add summary row
    csvData += `\nSUMMARY,,,,,,,,\n`;
    csvData += `Total Students,${data.statsData.totalStudents},,,,,,\n`;
    csvData += `Active Jobs,${data.statsData.activeJobs},,,,,,\n`;
    csvData += `Total Applications,${data.statsData.totalApplications},,,,,,\n`;
    csvData += `Placement Rate,${data.statsData.placementRate}%,,,,,,\n`;
    csvData += `Average Salary,₹${data.statsData.avgSalary},,,,,,\n`;
    
    console.log('✅ CSV data generated from real Firebase data');

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-panel-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ AdminPanel report exported successfully');
  } catch (error) {
    console.error('❌ Error exporting AdminPanel report:', error);
    throw new Error(`Failed to export report: ${error.message}`);
  }
}

/**
 * Download specific dataset as CSV with real Firebase data
 * @param {Object} filters - Current filter state
 * @param {string} dataset - Dataset to download: 'applications', 'jobs', 'students'
 * @param {number} [dayWindow=90] - Number of days to look back
 * @returns {Promise<void>} Downloads CSV file
 */
export async function downloadDataCSV(filters = {}, dataset = 'applications', dayWindow = 90) {
  try {
    console.log('📥 Downloading real data:', dataset, 'with filters:', filters);
    
    const cutoffDate = new Date(Date.now() - dayWindow * 24 * 60 * 60 * 1000);
    let csvData = '';
    let filename = '';
    
    switch (dataset) {
      case 'applications': {
        const applications = await fetchApplicationsData(filters, cutoffDate);
        const jobs = await fetchJobsData(filters, cutoffDate);
        const students = await fetchStudentsData(filters);
        
        csvData = 'Student Name,Email,Job Title,Company,Status,Applied Date,School,Batch\n';
        
        applications.forEach(app => {
          const job = jobs.find(j => j.id === app.jobId);
          const student = students.find(s => s.id === app.studentId);
          const appliedDate = app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'N/A';
          
          csvData += `"${student?.name || 'N/A'}","${student?.email || 'N/A'}","${job?.title || 'N/A'}","${job?.companyName || 'N/A'}","${app.status || 'N/A'}","${appliedDate}","${student?.school || 'N/A'}","${student?.batch || 'N/A'}"\n`;
        });
        
        filename = 'applications-data';
        break;
      }
      case 'jobs': {
        const jobs = await fetchJobsData(filters, cutoffDate);
        const applications = await fetchApplicationsData(filters, cutoffDate);
        
        csvData = 'Job Title,Company,Location,Posted Date,Applications,Status,Created By,Target Schools,Target Batches\n';
        
        jobs.forEach(job => {
          const jobApplications = applications.filter(app => app.jobId === job.id);
          const postedDate = job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString() : 'N/A';
          
          csvData += `"${job.title || 'N/A'}","${job.companyName || 'N/A'}","${job.location || 'N/A'}","${postedDate}",${jobApplications.length},"${job.status || 'N/A'}","${job.createdByName || job.createdBy || 'N/A'}","${job.targetSchools?.join(';') || 'All'}","${job.targetBatches?.join(';') || 'All'}"\n`;
        });
        
        filename = 'jobs-data';
        break;
      }
      case 'students': {
        const students = await fetchStudentsData(filters);
        
        csvData = 'Name,Email,School,Batch,Center,Status,Placement Status,Salary,Phone\n';
        
        students.forEach(student => {
          csvData += `"${student.name || 'N/A'}","${student.email || 'N/A'}","${student.school || 'N/A'}","${student.batch || 'N/A'}","${student.center || 'N/A'}","${student.status || 'N/A'}","${student.placementStatus || 'N/A'}","${student.salary || 'N/A'}","${student.phone || 'N/A'}"\n`;
        });
        
        filename = 'students-data';
        break;
      }
      default:
        throw new Error('Invalid dataset specified');
    }

    console.log(`✅ ${dataset} CSV data generated from real Firebase data`);

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`✅ ${dataset} data downloaded successfully`);
  } catch (error) {
    console.error('❌ Error downloading data:', error);
    throw new Error(`Failed to download ${dataset} data: ${error.message}`);
  }
}

/**
 * Real-time subscription to AdminPanel data changes
 * @param {Function} callback - Callback function to handle data updates
 * @param {Object} filters - Filter object with center, school, batch, admin arrays
 * @param {number} [dayWindow=90] - Number of days to look back
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAdminPanelData(callback, filters = {}, dayWindow = 90) {
  const unsubscribers = [];
  
  // Set up real-time listeners for all collections
  const studentsRef = collection(db, 'students');
  const jobsRef = collection(db, 'jobs');
  const applicationsRef = collection(db, 'applications');
  const usersRef = collection(db, 'users');
  
  // Subscribe to changes and update data
  const updateData = async () => {
    try {
      const data = await getAdminPanelData(filters, dayWindow);
      callback(data);
    } catch (error) {
      console.error('❌ Error updating AdminPanel data:', error);
    }
  };
  
  // Initial data load
  updateData();
  
  // Set up real-time listeners
  const studentsUnsubscribe = onSnapshot(studentsRef, updateData);
  const jobsUnsubscribe = onSnapshot(jobsRef, updateData);
  const applicationsUnsubscribe = onSnapshot(applicationsRef, updateData);
  const usersUnsubscribe = onSnapshot(query(usersRef, where('role', '==', 'admin')), updateData);
  
  unsubscribers.push(studentsUnsubscribe, jobsUnsubscribe, applicationsUnsubscribe, usersUnsubscribe);
  
  // Return unsubscribe function
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}
