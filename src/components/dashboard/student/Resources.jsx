import React, { useState } from 'react';
import { 
  FaSearch,
  FaExternalLinkAlt,
  FaChevronRight,
  FaChartLine,
  FaUserTie,
  FaHeartbeat,
  FaLaptopCode,
  FaGraduationCap,
  FaCertificate,
  FaUsers,
  FaBriefcase,
  FaRegClock
} from 'react-icons/fa';

const PlacementResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const resourceCategories = [
    { id: 'all', name: 'All Resources', icon: <FaChartLine /> },
    { id: 'tech', name: 'Technology', icon: <FaLaptopCode /> },
    { id: 'management', name: 'Management', icon: <FaUserTie /> },
    { id: 'healthcare', name: 'Healthcare', icon: <FaHeartbeat /> },
    { id: 'certification', name: 'Certifications', icon: <FaCertificate /> }
  ];

  const stats = {
    placementBoost: '63%',
    salaryIncrease: '27%',
    interviewRate: '41%',
    certificationValue: '89%'
  };

  const resources = [
    {
      id: 1,
      title: 'LeetCode',
      category: 'tech',
      description: 'Practice coding problems and prepare for technical interviews at top tech companies',
      link: 'https://leetcode.com',
      free: true,
      certification: true,
      metrics: 'Used by 85% of FAANG applicants',
      bestFor: 'Software engineering roles'
    },
    {
      id: 2,
      title: 'Coursera',
      category: 'certification',
      description: 'Professional certificates from leading companies like Google, IBM, and Meta',
      link: 'https://coursera.org',
      free: true,
      certification: true,
      metrics: 'Over 5,000 courses available',
      bestFor: 'All disciplines - tech, business, healthcare'
    },
    {
      id: 3,
      title: 'CaseCoach',
      category: 'management',
      description: 'Management consulting case interview preparation with practice cases',
      link: 'https://casecoach.com',
      free: false,
      certification: false,
      metrics: 'Used by 70% of MBB hires',
      bestFor: 'Consulting and business roles'
    },
    {
      id: 4,
      title: 'Kaggle',
      category: 'tech',
      description: 'Data science competitions and learning resources for all skill levels',
      link: 'https://kaggle.com',
      free: true,
      certification: true,
      metrics: '2 million+ data science community',
      bestFor: 'Data science and analytics roles'
    },
    {
      id: 5,
      title: 'Coursera Business',
      category: 'management',
      description: 'Business fundamentals, leadership, and strategy courses',
      link: 'https://coursera.org/business',
      free: true,
      certification: true,
      metrics: 'Top-ranked business courses',
      bestFor: 'Aspiring managers and executives'
    },
    {
      id: 6,
      title: 'edX Healthcare',
      category: 'healthcare',
      description: 'Medical, public health, and healthcare management courses',
      link: 'https://edx.org/learn/healthcare',
      free: true,
      certification: true,
      metrics: 'Courses from Harvard, Johns Hopkins',
      bestFor: 'Healthcare professionals'
    },
    {
      id: 7,
      title: 'HackerRank',
      category: 'tech',
      description: 'Coding challenges and company-sponsored competitions',
      link: 'https://hackerrank.com',
      free: true,
      certification: true,
      metrics: 'Used by 2,000+ companies for hiring',
      bestFor: 'Software developers'
    },
    {
      id: 8,
      title: 'Management Consulted',
      category: 'management',
      description: 'The leading resource for consulting case interview preparation',
      link: 'https://managementconsulted.com',
      free: false,
      certification: false,
      metrics: '1,000+ practice cases',
      bestFor: 'Consulting candidates'
    },
    {
      id: 9,
      title: 'Coursera Healthcare',
      category: 'healthcare',
      description: 'Medical, nursing, and public health specializations',
      link: 'https://coursera.org/healthcare',
      free: true,
      certification: true,
      metrics: 'Industry-recognized credentials',
      bestFor: 'Healthcare career advancement'
    },
    {
      id: 10,
      title: 'StrategyCase',
      category: 'management',
      description: 'Case interview preparation for strategy and management roles',
      link: 'https://strategycase.com',
      free: false,
      certification: false,
      metrics: 'Used by top business school students',
      bestFor: 'Strategy and management roles'
    },
    {
      id: 11,
      title: 'NIH Training Resources',
      category: 'healthcare',
      description: 'Free training resources from the National Institutes of Health',
      link: 'https://training.nih.gov',
      free: true,
      certification: true,
      metrics: 'Government-backed credentials',
      bestFor: 'Healthcare and research roles'
    },
    {
      id: 12,
      title: 'Udemy Business',
      category: 'management',
      description: 'Business, leadership, and soft skills courses',
      link: 'https://udemy.com/business',
      free: false,
      certification: true,
      metrics: '8,000+ business courses',
      bestFor: 'Professional development'
    }
  ];

  const filteredResources = activeTab === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeTab);

  const searchedResources = searchQuery
    ? filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.bestFor.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredResources;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-gray-800 mb-4">Professional Development Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated platforms to enhance your skills, earn certifications, and improve your placement opportunities
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Why These Resources Matter</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 mb-1">{stats.placementBoost}</div>
              <div className="text-sm text-blue-600">Higher placement rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700 mb-1">{stats.salaryIncrease}</div>
              <div className="text-sm text-green-600">Average salary increase</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700 mb-1">{stats.interviewRate}</div>
              <div className="text-sm text-purple-600">More interview calls</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700 mb-1">{stats.certificationValue}</div>
              <div className="text-sm text-amber-600">Of hiring managers value certifications</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by skill, platform, or industry..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              {searchedResources.length} resources found
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide mb-8 bg-white rounded-lg shadow-sm p-2">
          {resourceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-4 py-3 flex items-center whitespace-nowrap rounded-md transition-colors ${activeTab === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="mr-2 text-blue-500">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="divide-y divide-gray-100">
            {searchedResources.map(resource => (
              <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start">
                      <h3 className="text-lg font-semibold text-gray-800 mr-2">{resource.title}</h3>
                      {resource.free && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Free
                        </span>
                      )}
                      {resource.certification && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                          Certification
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{resource.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaChartLine className="mr-1 text-blue-400" />
                        {resource.metrics}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <FaBriefcase className="mr-1 text-blue-400" />
                        {resource.bestFor}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-2"
                    >
                      Visit Resource <FaChevronRight className="ml-1" />
                    </a>
                    <span className="text-xs text-gray-400">External link</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Maximize Your Placement Potential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FaCertificate className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Stand Out to Employers</h3>
                <p className="text-gray-600 text-sm">
                  Certifications from recognized platforms demonstrate initiative and verified skills, making your resume more compelling to hiring managers.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Build Industry-Relevant Skills</h3>
                <p className="text-gray-600 text-sm">
                  These resources are used by professionals in your target industry, ensuring you develop skills that are directly applicable to your desired role.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <FaRegClock className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Learn at Your Own Pace</h3>
                <p className="text-gray-600 text-sm">
                  Most platforms offer self-paced learning, allowing you to develop new skills alongside your academic commitments.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-lg mr-4">
                <FaGraduationCap className="text-amber-600 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Complement Your Degree</h3>
                <p className="text-gray-600 text-sm">
                  These resources provide practical, applied learning that complements theoretical knowledge from your academic program.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ready to enhance your career profile?</h2>
          <p className="text-gray-600 mb-4">
            Start with one resource today and add valuable certifications to your resume
          </p>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Explore Top Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementResources;