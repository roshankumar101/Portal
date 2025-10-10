import React, { useState, useEffect } from 'react';
import { ImEye } from 'react-icons/im';
import { MdBlock  } from 'react-icons/md';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaTimes, FaUserEdit, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { Loader } from 'lucide-react';
import { getAllStudents, updateStudentStatus, updateStudentProfile, getEducationalBackground, getStudentSkills, updateEducationalBackground } from '../../../services/students';
import { useAuth } from '../../../hooks/useAuth';
import { onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../../firebase';

// Student Details Modal
const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  const [detailedStudent, setDetailedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch detailed student data when modal opens
  useEffect(() => {
    if (isOpen && student?.id) {
      fetchDetailedStudentData();
    }
  }, [isOpen, student?.id]);
  
  const fetchDetailedStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [educationData, skillsData] = await Promise.all([
        getEducationalBackground(student.id),
        getStudentSkills(student.id)
      ]);
      
      setDetailedStudent({
        ...student,
        education: educationData.sort((a, b) => new Date(b.endYear || '9999') - new Date(a.endYear || '9999')),
        skills: skillsData.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      });
      
    } catch (err) {
      console.error('Error fetching detailed student data:', err);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  const studentData = detailedStudent || student;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading student details...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchDetailedStudentData}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-800">{studentData.fullName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-800 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" size={14} />
                    {studentData.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-800 flex items-center">
                    <FaPhone className="mr-2 text-gray-400" size={14} />
                    {studentData.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment ID</label>
                  <p className="text-gray-800 flex items-center">
                    <FaIdCard className="mr-2 text-gray-400" size={14} />
                    {studentData.enrollmentId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-green-600" />
                Academic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">School</label>
                  <p className="text-gray-800">{studentData.school || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Center</label>
                  <p className="text-gray-800 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" size={14} />
                    {studentData.center || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CGPA</label>
                  <p className="text-gray-800">{studentData.cgpa || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Batch</label>
                  <p className="text-gray-800 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" size={14} />
                    {studentData.batch || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-800">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      studentData.status === 'Active' ? 'bg-green-100 text-green-800' :
                      studentData.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {studentData.status || 'Active'}
                    </span>
                  </p>
                  {studentData.blockDetails && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs text-red-600">
                        <strong>Blocked:</strong> {studentData.blockDetails.reason}
                      </p>
                      {studentData.blockDetails.notes && (
                        <p className="text-xs text-red-600 mt-1">{studentData.blockDetails.notes}</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-800">{studentData.bio || 'No bio available'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tagline</label>
                  <p className="text-gray-800">{studentData.tagline || 'No tagline available'}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Application Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{student.stats?.applied || 0}</div>
                  <div className="text-sm text-gray-500">Applied</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{student.stats?.shortlisted || 0}</div>
                  <div className="text-sm text-gray-500">Shortlisted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{student.stats?.interviewed || 0}</div>
                  <div className="text-sm text-gray-500">Interviewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{studentData.stats?.offers || 0}</div>
                  <div className="text-sm text-gray-500">Offers</div>
                </div>
              </div>
            </div>
            
            {/* Educational Background */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-purple-600" />
                Educational Background
              </h3>
              {studentData.education && studentData.education.length > 0 ? (
                <div className="space-y-3">
                  {studentData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{edu.degree || 'N/A'}</p>
                          <p className="text-gray-600">{edu.institution || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {edu.fieldOfStudy && `${edu.fieldOfStudy} • `}
                            {edu.startYear || 'N/A'} - {edu.endYear || 'Present'}
                          </p>
                        </div>
                        {edu.gpa && (
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">GPA: {edu.gpa}</p>
                          </div>
                        )}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No educational background information available</p>
              )}
            </div>
            
            {/* Skills */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
              {studentData.skills && studentData.skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studentData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <span className="font-medium text-gray-800">{skill.skillName}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Rating:</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              className={`text-sm ${
                                star <= (skill.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-1 text-xs text-gray-600">({skill.rating || 0}/5)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills information available</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Student Modal
const EditStudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    center: '',
    school: '',
    cgpa: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        center: student.center || '',
        school: student.school || '',
        cgpa: student.cgpa || ''
      });
      setErrors({});
    }
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.center.trim()) {
      newErrors.center = 'Center is required';
    }
    
    if (!formData.school.trim()) {
      newErrors.school = 'School is required';
    }
    
    if (!formData.cgpa.trim()) {
      newErrors.cgpa = 'CGPA is required';
    } else {
      const cgpaValue = parseFloat(formData.cgpa);
      if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
        newErrors.cgpa = 'CGPA must be between 0 and 10';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(student.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={student.fullName || ''}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center *
              </label>
              <select
                name="center"
                value={formData.center}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.center ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Center</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Lucknow">Lucknow</option>
              </select>
              {errors.center && <p className="text-red-500 text-sm mt-1">{errors.center}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.school ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select School</option>
                <option value="School of Technology">School of Technology</option>
                <option value="School of Management">School of Management</option>
                <option value="School of Humanities">School of Humanities</option>
                <option value="School of Design">School of Design</option>
                <option value="School of Law">School of Law</option>
              </select>
              {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CGPA *
              </label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="Enter CGPA (0-10)"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cgpa ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cgpa && <p className="text-red-500 text-sm mt-1">{errors.cgpa}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader className="h-4 w-4 animate-spin mr-2" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlockStudentModal = ({ isOpen, onClose, student, onConfirm }) => {
  const [blockType, setBlockType] = useState('Permanent');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [otherReason, setOtherReason] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setBlockType('Permanent');
      setEndDate('');
      setEndTime('');
      setReason('');
      setNotes('');
      setOtherReason('');
    }
  }, [isOpen]);

  const isConfirmEnabled =
    reason &&
    notes &&
    (blockType === 'Permanent' || (blockType === 'Temporary' && endDate && endTime));

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm({
        blockType,
        endDate: blockType === 'Temporary' ? endDate : null,
        endTime: blockType === 'Temporary' ? endTime : null,
        reason: reason === 'Other' ? otherReason : reason,
        notes,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Block Student</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Are you sure you want to block the following student? This action is irreversible.
        </p>
        <div className="mb-4">
          <p className="text-sm sm:text-base font-medium text-gray-700">Name: {student?.fullName}</p>
          <p className="text-sm sm:text-base font-medium text-gray-700">Enrollment ID: {student?.enrollmentId}</p>
          <p className="text-sm sm:text-base font-medium text-gray-700">Program: {student?.school}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Block Type</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="blockType"
                value="Permanent"
                checked={blockType === 'Permanent'}
                onChange={() => setBlockType('Permanent')}
                className="mr-2"
              />
              Permanent Block
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="blockType"
                value="Temporary"
                checked={blockType === 'Temporary'}
                onChange={() => setBlockType('Temporary')}
                className="mr-2"
              />
              Temporary Block
            </label>
          </div>
        </div>
        {blockType === 'Temporary' && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Reason for Blocking</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a reason</option>
            <option value="Placed Already">Placed Already</option>
            <option value="Academic Reasons">Academic Reasons</option>
            <option value="Policy Violation">Policy Violation</option>
            <option value="Other">Other</option>
          </select>
          {reason === 'Other' && (
            <input
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Specify the reason"
              className="w-full mt-2 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Administrative Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide specific details for the audit log"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        <p className="text-sm sm:text-base text-red-600 mb-4">
          Warning: {blockType === 'Permanent'
            ? 'Blocking this student will permanently revoke their application privileges.'
            : `Blocking this student will revoke their application privileges until ${endDate} ${endTime}.`}
        </p>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={`px-4 py-2 rounded-lg text-white ${isConfirmEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Confirm Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default function StudentDirectory() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    center: '',
    school: '',
    status: '',
    minCgpa: '',
    maxCgpa: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const studentsPerPage = 10;

  // Set up real-time students subscription
  useEffect(() => {
    setupStudentSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const setupStudentSubscription = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create real-time subscription to students collection
      // Note: For full filtering, we use client-side filtering due to Firestore compound query limitations
      // This provides the best balance of performance and functionality
      const studentsQuery = query(
        collection(db, 'students'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribeFn = onSnapshot(
        studentsQuery,
        async (snapshot) => {
          console.log('📡 Real-time update - Students received:', snapshot.docs.length);
          
          const studentsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const studentData = doc.data();
              
              // Fetch additional data for each student
              try {
                const [educationData, skillsData] = await Promise.all([
                  getEducationalBackground(doc.id).catch(() => []),
                  getStudentSkills(doc.id).catch(() => [])
                ]);
                
                // Get highest education level
                const highestEducation = educationData
                  .filter(ed => ed.degree)
                  .sort((a, b) => {
                    const order = { 'Masters': 3, 'Bachelors': 2, 'Diploma': 1 };
                    return (order[b.degree] || 0) - (order[a.degree] || 0);
                  })[0];
                
                // Get top 3 skills
                const topSkills = skillsData
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .slice(0, 3)
                  .map(skill => skill.skillName);
                  
                return {
                  id: doc.id,
                  uid: studentData.uid,
                  fullName: studentData.fullName || studentData.name || 'N/A',
                  email: studentData.email || 'N/A',
                  center: studentData.center || 'N/A',
                  school: studentData.school || 'N/A',
                  cgpa: studentData.cgpa || 'N/A',
                  phone: studentData.phone || 'N/A',
                  batch: studentData.batch || 'N/A',
                  enrollmentId: studentData.enrollmentId || studentData.studentId || 'N/A',
                  status: studentData.status || 'Active',
                  bio: studentData.bio || '',
                  tagline: studentData.tagline || '',
                  createdAt: studentData.createdAt,
                  updatedAt: studentData.updatedAt,
                  blockDetails: studentData.blockDetails || null,
                  stats: studentData.stats || { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 },
                  // Additional computed fields
                  highestEducation: highestEducation?.degree || 'N/A',
                  institution: highestEducation?.institution || 'N/A',
                  topSkills: topSkills
                };
              } catch (err) {
                console.warn('Error fetching additional data for student:', doc.id, err);
                return {
                  id: doc.id,
                  uid: studentData.uid,
                  fullName: studentData.fullName || studentData.name || 'N/A',
                  email: studentData.email || 'N/A',
                  center: studentData.center || 'N/A',
                  school: studentData.school || 'N/A',
                  cgpa: studentData.cgpa || 'N/A',
                  phone: studentData.phone || 'N/A',
                  batch: studentData.batch || 'N/A',
                  enrollmentId: studentData.enrollmentId || studentData.studentId || 'N/A',
                  status: studentData.status || 'Active',
                  bio: studentData.bio || '',
                  tagline: studentData.tagline || '',
                  createdAt: studentData.createdAt,
                  updatedAt: studentData.updatedAt,
                  blockDetails: studentData.blockDetails || null,
                  stats: studentData.stats || { applied: 0, shortlisted: 0, interviewed: 0, offers: 0 },
                  highestEducation: 'N/A',
                  institution: 'N/A',
                  topSkills: []
                };
              }
            })
          );
          
          setStudents(studentsData);
          setLoading(false);
        },
        (error) => {
          console.error('❌ Error in students subscription:', error);
          setError('Failed to load students data');
          setLoading(false);
        }
      );
      
      setUnsubscribe(() => unsubscribeFn);
      
    } catch (err) {
      console.error('Error setting up students subscription:', err);
      setError('Failed to load students data');
      setLoading(false);
    }
  };
  
  const refreshStudents = () => {
    setupStudentSubscription();
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.enrollmentId.toLowerCase().includes(search.toLowerCase());
    const matchesCenter = filters.center ? student.center === filters.center : true;
    const matchesSchool = filters.school ? student.school === filters.school : true;
    const matchesStatus = filters.status ? student.status === filters.status : true;
    const matchesMinCgpa = filters.minCgpa ? parseFloat(student.cgpa) >= parseFloat(filters.minCgpa) : true;
    const matchesMaxCgpa = filters.maxCgpa ? parseFloat(student.cgpa) <= parseFloat(filters.maxCgpa) : true;

    return (
      matchesSearch &&
      matchesCenter &&
      matchesSchool &&
      matchesStatus &&
      matchesMinCgpa &&
      matchesMaxCgpa
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let validatedValue = value;

    if (name === 'minCgpa') {
      validatedValue = Math.max(0, parseFloat(value) || 0);
    } else if (name === 'maxCgpa') {
      validatedValue = Math.min(10, parseFloat(value) || 10);
    }

    setFilters((prev) => ({ ...prev, [name]: validatedValue }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      center: '',
      school: '',
      status: '',
      minCgpa: '',
      maxCgpa: '',
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBlockClick = (student) => {
    setSelectedStudent(student);
    setBlockModalOpen(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleEditSave = async (studentId, updatedData) => {
    if (!canModifyStudents()) {
      alert('Only administrators can edit student information.');
      throw new Error('Permission denied');
    }
    
    try {
      setOperationLoading(true);
      // Update student profile
      await updateStudentProfile(studentId, updatedData);
      
      // If educational background fields are being updated, handle them separately
      if (updatedData.school || updatedData.cgpa || updatedData.center) {
        try {
          // Get existing education records
          const existingEducation = await getEducationalBackground(studentId);
          
          // Update or create current education record
          if (existingEducation.length > 0) {
            // Update the most recent education record
            const latestEducation = existingEducation[0];
            await updateEducationalBackground(latestEducation.id, {
              institution: updatedData.school || latestEducation.institution,
              gpa: updatedData.cgpa || latestEducation.gpa,
              updatedAt: new Date()
            });
          }
        } catch (educationError) {
          console.warn('Failed to update educational background:', educationError);
          // Don't fail the main update if education update fails
        }
      }
      
      console.log('Student updated successfully');
      alert('Student information updated successfully!');
      
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student');
      alert('Failed to update student: ' + (error.message || 'Unknown error'));
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Permission check for admin-only actions
  const canModifyStudents = () => {
    return user && (user.role === 'admin' || user.userType === 'admin');
  };

  const handleBlockConfirm = async (blockDetails) => {
    if (!canModifyStudents()) {
      alert('Only administrators can block/unblock students.');
      return;
    }
    
    if (operationLoading) {
      return; // Prevent multiple operations
    }
    
    try {
      setOperationLoading(true);
      const newStatus = selectedStudent.status === 'Blocked' ? 'Active' : 'Blocked';
      const isBlocking = newStatus === 'Blocked';
      
      // Enhanced block details with admin info
      const enhancedBlockDetails = isBlocking ? {
        ...blockDetails,
        blockedBy: user.uid,
        blockedByName: user.displayName || user.email || 'Admin',
        blockedAt: new Date()
      } : null;
      
      // Update student status
      await updateStudentStatus(selectedStudent.id, newStatus, enhancedBlockDetails);
      
      // Create notification entry for audit trail
      try {
        const notificationData = {
          type: isBlocking ? 'student_blocked' : 'student_unblocked',
          title: `Student ${isBlocking ? 'Blocked' : 'Unblocked'}`,
          message: `${selectedStudent.fullName} (${selectedStudent.enrollmentId}) has been ${isBlocking ? 'blocked' : 'unblocked'} by ${user.displayName || user.email}`,
          studentId: selectedStudent.id,
          studentName: selectedStudent.fullName,
          studentEnrollmentId: selectedStudent.enrollmentId,
          adminId: user.uid,
          adminName: user.displayName || user.email || 'Admin',
          priority: 'high',
          metadata: {
            reason: isBlocking ? blockDetails.reason : 'Unblocked',
            notes: isBlocking ? blockDetails.notes : 'Student account unblocked',
            studentEmail: selectedStudent.email,
            studentCenter: selectedStudent.center,
            studentSchool: selectedStudent.school
          },
          createdAt: serverTimestamp(),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
        };
        
        await addDoc(collection(db, 'notifications'), notificationData);
        console.log('Notification created for student status change');
        
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
        // Don't fail the operation if notification fails
      }
      
      console.log(`Student ${isBlocking ? 'blocked' : 'unblocked'} successfully`);
      alert(`Student has been ${isBlocking ? 'blocked' : 'unblocked'} successfully.`);
      
    } catch (error) {
      console.error('Error updating student status:', error);
      setError('Failed to update student status');
      alert('Failed to update student status: ' + (error.message || 'Unknown error'));
    } finally {
      setOperationLoading(false);
    }
  };

  // Get unique values for filter dropdowns
  const uniqueCenters = [...new Set(students.map(s => s.center).filter(c => c && c !== 'N/A'))];
  const uniqueSchools = [...new Set(students.map(s => s.school).filter(s => s && s !== 'N/A'))];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <span className="text-gray-600">Loading students...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshStudents}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student Directory</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshStudents}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Refresh
            </button>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or enrollment ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Toggle filters"
          >
            <FaFilter />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
                <select
                  name="center"
                  value={filters.center}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Centers</option>
                  {uniqueCenters.map(center => (
                    <option key={center} value={center}>{center}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <select
                  name="school"
                  value={filters.school}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Schools</option>
                  {uniqueSchools.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status(es)</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                <input
                  type="number"
                  name="minCgpa"
                  placeholder="0.00"
                  min="0"
                  max="10"
                  step="0.01"
                  value={filters.minCgpa}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max CGPA</label>
                <input
                  type="number"
                  name="maxCgpa"
                  placeholder="10.00"
                  min="0"
                  max="10"
                  step="0.01"
                  value={filters.maxCgpa}
                  onChange={handleFilterChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Student Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Enrollment ID</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Center</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">School</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">CGPA</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4 text-gray-800 font-medium">{student.fullName}</td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{student.enrollmentId}</td>
                    <td className="p-4 text-gray-600">{student.center}</td>
                    <td className="p-4 text-gray-600">{student.school}</td>
                    <td className="p-4 text-gray-600 font-medium">{student.cgpa}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="relative group">
                          <button 
                            onClick={() => handleViewDetails(student)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <ImEye className="text-lg" />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            View Details
                          </span>
                        </div>
                        <div className="relative group">
                          <button 
                            onClick={() => handleEditStudent(student)}
                            disabled={!canModifyStudents() || operationLoading}
                            className={`p-2 rounded-lg transition-colors ${
                              operationLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : canModifyStudents() 
                                ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {operationLoading ? <Loader className="h-5 w-5 animate-spin" /> : <FaUserEdit className="text-xl" />}
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {canModifyStudents() ? 'Edit Student' : 'Admin access required'}
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => handleBlockClick(student)}
                            disabled={!canModifyStudents() || operationLoading}
                            className={`p-2 rounded-lg transition-colors ${
                              operationLoading
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : canModifyStudents() 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {operationLoading ? <Loader className="h-5 w-5 animate-spin" /> : <MdBlock  className="text-xl" />}
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {canModifyStudents() 
                              ? `${student.status === 'Blocked' ? 'Unblock' : 'Block'} Student`
                              : 'Admin access required'
                            }
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-500">No students found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaChevronLeft className="mr-1 text-xs" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'} transition-colors`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-1 text-gray-500">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      <StudentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        student={selectedStudent}
      />

      <EditStudentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleEditSave}
      />

      <BlockStudentModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        student={selectedStudent}
        onConfirm={handleBlockConfirm}
      />
    </div>
  );
}