import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  endAt,
  startAt
} from 'firebase/firestore';
import { db } from '../firebase';

// Real-time dashboard statistics service
export class AdminDashboardService {
  constructor() {
    this.subscribers = [];
    this.cachedData = {
      stats: {
        totalJobsPosted: 0,
        activeRecruiters: 0,
        activeStudents: 0,
        pendingQueries: 0,
        totalApplications: 0,
        placedStudents: 0
      },
      chartData: {
        placementTrend: [],
        recruiterActivity: [],
        queryVolume: [],
        schoolPerformance: {}
      }
    };
  }

  // Subscribe to real-time dashboard data
  subscribeToDashboardData(callback, filters = {}) {
    const unsubscribers = [];

    // 1. Subscribe to Jobs (Total Posted Jobs)
    const jobsQuery = query(
      collection(db, 'jobs'),
      where('status', '==', 'posted')
    );
    
    const jobsUnsubscribe = onSnapshot(jobsQuery, async (snapshot) => {
      let jobs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        jobs.push({ id: doc.id, ...data });
      });

      // Apply filters
      if (filters.center?.length > 0) {
        jobs = jobs.filter(job => 
          job.targetCenters && job.targetCenters.some(center => filters.center.includes(center))
        );
      }
      if (filters.school?.length > 0) {
        jobs = jobs.filter(job => 
          job.targetSchools && job.targetSchools.some(school => filters.school.includes(school))
        );
      }
      if (filters.quarter?.length > 0) {
        // Quarter filtering based on driveDate
        jobs = jobs.filter(job => {
          if (!job.driveDate) return true;
          const driveDate = new Date(job.driveDate);
          const quarter = Math.floor(driveDate.getMonth() / 3) + 1;
          return filters.quarter.some(q => q.includes(`Q${quarter}`));
        });
      }

      this.cachedData.stats.totalJobsPosted = jobs.length;
      
      // Build recruiter activity chart data
      const recruiterActivity = this.buildRecruiterActivityData(jobs);
      this.cachedData.chartData.recruiterActivity = recruiterActivity;
      
      callback(this.cachedData);
    });
    unsubscribers.push(jobsUnsubscribe);

    // 2. Subscribe to Users (Active Recruiters)
    const recruitersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'recruiter')
    );
    
    const recruitersUnsubscribe = onSnapshot(recruitersQuery, (snapshot) => {
      const activeRecruiters = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.isActive !== false; // Default to active if not specified
      });
      
      this.cachedData.stats.activeRecruiters = activeRecruiters.length;
      callback(this.cachedData);
    });
    unsubscribers.push(recruitersUnsubscribe);

    // 3. Subscribe to Students (Active Students)
    const studentsQuery = query(collection(db, 'students'));
    
    const studentsUnsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      let students = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        students.push({ id: doc.id, ...data });
      });

      // Apply filters
      if (filters.center?.length > 0) {
        students = students.filter(student => 
          filters.center.includes(student.center)
        );
      }
      if (filters.school?.length > 0) {
        students = students.filter(student => 
          filters.school.some(school => student.school?.includes(school))
        );
      }

      const activeStudents = students.filter(student => 
        student.status === 'Active' || !student.status
      );
      
      this.cachedData.stats.activeStudents = activeStudents.length;
      
      // Build school performance data
      const schoolPerformance = this.buildSchoolPerformanceData(students);
      this.cachedData.chartData.schoolPerformance = schoolPerformance;
      
      callback(this.cachedData);
    });
    unsubscribers.push(studentsUnsubscribe);

    // 4. Subscribe to Student Queries (Pending Queries)
    const queriesQuery = query(
      collection(db, 'student_queries'),
      where('status', 'in', ['pending', 'under_review'])
    );
    
    const queriesUnsubscribe = onSnapshot(queriesQuery, (snapshot) => {
      this.cachedData.stats.pendingQueries = snapshot.docs.length;
      
      // Build query volume chart data
      const queryVolume = this.buildQueryVolumeData(snapshot.docs);
      this.cachedData.chartData.queryVolume = queryVolume;
      
      callback(this.cachedData);
    });
    unsubscribers.push(queriesUnsubscribe);

    // 5. Subscribe to Applications (Total Applications & Placed Students)
    const applicationsQuery = query(collection(db, 'applications'));
    
    const applicationsUnsubscribe = onSnapshot(applicationsQuery, async (snapshot) => {
      let applications = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        applications.push({ id: doc.id, ...data });
      });

      // Apply filters by matching with student data
      if (filters.center?.length > 0 || filters.school?.length > 0) {
        // Get student data for filtering
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentMap = new Map();
        studentsSnapshot.forEach(doc => {
          studentMap.set(doc.id, doc.data());
        });

        applications = applications.filter(app => {
          const student = studentMap.get(app.studentId);
          if (!student) return true;
          
          let matches = true;
          if (filters.center?.length > 0) {
            matches = matches && filters.center.includes(student.center);
          }
          if (filters.school?.length > 0) {
            matches = matches && filters.school.some(school => student.school?.includes(school));
          }
          return matches;
        });
      }

      this.cachedData.stats.totalApplications = applications.length;
      
      const placedStudents = applications.filter(app => 
        app.status === 'selected' || app.status === 'offered'
      );
      this.cachedData.stats.placedStudents = placedStudents.length;
      
      // Build placement trend data
      const placementTrend = this.buildPlacementTrendData(applications);
      this.cachedData.chartData.placementTrend = placementTrend;
      
      callback(this.cachedData);
    });
    unsubscribers.push(applicationsUnsubscribe);

    // Return combined unsubscribe function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  // Build recruiter activity chart data
  buildRecruiterActivityData(jobs) {
    const recruiterCounts = {};
    jobs.forEach(job => {
      if (job.recruiterId) {
        recruiterCounts[job.recruiterId] = (recruiterCounts[job.recruiterId] || 0) + 1;
      }
    });

    // Get top 5 recruiters
    const topRecruiters = Object.entries(recruiterCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([recruiterId, count]) => ({
        recruiterId,
        count,
        label: `Recruiter ${recruiterId.slice(-4)}` // Use last 4 chars as label
      }));

    // Return empty chart structure if no data
    if (topRecruiters.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Active Jobs',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      };
    }

    return {
      labels: topRecruiters.map(r => r.label),
      datasets: [{
        label: 'Active Jobs',
        data: topRecruiters.map(r => r.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ].slice(0, topRecruiters.length),
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)'
        ].slice(0, topRecruiters.length),
        borderWidth: 1
      }]
    };
  }

  // Build query volume chart data
  buildQueryVolumeData(queryDocs) {
    const volumeByType = {
      question: 0,
      cgpa: 0,
      calendar: 0
    };

    queryDocs.forEach(doc => {
      const data = doc.data();
      if (volumeByType.hasOwnProperty(data.type)) {
        volumeByType[data.type]++;
      }
    });

    return [
      { title: 'Questions', value: volumeByType.question, color: '#3b82f6' },
      { title: 'CGPA Updates', value: volumeByType.cgpa, color: '#10b981' },
      { title: 'Calendar Blocks', value: volumeByType.calendar, color: '#8b5cf6' }
    ];
  }

  // Build placement trend data
  buildPlacementTrendData(applications) {
    const monthlyData = {};
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[key] = { label, applied: 0, selected: 0 };
    }

    applications.forEach(app => {
      if (app.appliedDate) {
        const appDate = new Date(app.appliedDate);
        const key = `${appDate.getFullYear()}-${(appDate.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (monthlyData[key]) {
          monthlyData[key].applied++;
          if (app.status === 'selected' || app.status === 'offered') {
            monthlyData[key].selected++;
          }
        }
      }
    });

    const sortedData = Object.values(monthlyData).sort((a, b) => a.label.localeCompare(b.label));

    return {
      labels: sortedData.map(d => d.label),
      datasets: [
        {
          label: 'Applications',
          data: sortedData.map(d => d.applied),
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true
        },
        {
          label: 'Placements',
          data: sortedData.map(d => d.selected),
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }

  // Build school performance data
  buildSchoolPerformanceData(students) {
    const schoolData = {
      SOT: { students: [], applications: 0, placements: 0 },
      SOM: { students: [], applications: 0, placements: 0 },
      SOH: { students: [], applications: 0, placements: 0 }
    };

    students.forEach(student => {
      const school = student.school?.includes('Technology') ? 'SOT' :
                    student.school?.includes('Management') ? 'SOM' :
                    student.school?.includes('Health') ? 'SOH' : 'SOT'; // Default

      if (schoolData[school]) {
        schoolData[school].students.push(student);
        if (student.stats) {
          schoolData[school].applications += student.stats.applied || 0;
          schoolData[school].placements += student.stats.offers || 0;
        }
      }
    });

    // Build radar chart data for each school
    const result = {};
    Object.keys(schoolData).forEach(schoolKey => {
      const school = schoolData[schoolKey];
      const studentCount = school.students.length;
      const avgCGPA = studentCount > 0 ? 
        school.students.reduce((sum, s) => sum + (parseFloat(s.cgpa) || 0), 0) / studentCount : 0;
      
      const placementRate = school.applications > 0 ? 
        (school.placements / school.applications) * 100 : 0;

      result[schoolKey] = {
        performance: {
          labels: ['Placement Rate', 'Avg CGPA', 'Active Students', 'Application Rate', 'Engagement'],
          values: [
            Math.round(placementRate),
            Math.round((avgCGPA / 10) * 100), // Convert to percentage
            Math.round((studentCount / Math.max(...Object.values(schoolData).map(s => s.students.length))) * 100),
            Math.round((school.applications / Math.max(1, studentCount)) * 10), // Applications per student * 10
            Math.round(75 + Math.random() * 20) // Engagement placeholder
          ]
        },
        applications: {
          labels: ['Total Students', 'Applications', 'Placements', 'Success Rate', 'Avg CGPA'],
          values: [
            studentCount,
            school.applications,
            school.placements,
            Math.round(placementRate),
            Math.round(avgCGPA * 10) // Scale for chart
          ]
        }
      };
    });

    return result;
  }

  // Get current cached data
  getCachedData() {
    return this.cachedData;
  }

  // Clean up subscriptions
  cleanup() {
    this.subscribers.forEach(unsub => unsub());
    this.subscribers = [];
  }
}

// Export singleton instance
export const adminDashboardService = new AdminDashboardService();

// Helper function to get dashboard stats with filters
export const getDashboardStats = (filters = {}) => {
  return new Promise((resolve) => {
    const unsubscribe = adminDashboardService.subscribeToDashboardData((data) => {
      unsubscribe(); // Unsubscribe immediately for one-time fetch
      resolve(data);
    }, filters);
  });
};

// Real-time subscription hook for React components
export const useAdminDashboard = (filters = {}) => {
  return {
    subscribe: (callback) => adminDashboardService.subscribeToDashboardData(callback, filters),
    getCached: () => adminDashboardService.getCachedData(),
    cleanup: () => adminDashboardService.cleanup()
  };
};