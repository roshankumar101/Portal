import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUser } from '../../services/users';
import {
  Edit3,
  Save,
  X,
  Upload,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Loader,
} from 'lucide-react';

const EditableProfile = ({ studentData, onDataUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    enrollmentId: '',
    department: '',
    skills: [],
    resumeUrl: '',
    leetcodeProfile: '',
    batch: '',
    centre: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [centreOptions, setCentreOptions] = useState([]);

  useEffect(() => {
    // Initialize form data when studentData changes
    if (studentData) {
      setFormData({
        name: studentData.name || '',
        enrollmentId: studentData.enrollmentId || studentData.rollNo || '',
        department: studentData.department || '',
        skills: studentData.skills || [],
        resumeUrl: studentData.resumeUrl || '',
        leetcodeProfile: studentData.leetcodeProfile || '',
        batch: studentData.batch || '',
        centre: studentData.centre || '',
      });
    }

    // Mock fetch batch and centre options (replace with real API)
    const fetchBatchOptions = async () => {
      await new Promise(r => setTimeout(r, 300)); // simulate delay
      setBatchOptions(['2023-2027', '2024-2028', '2025-2029']);
    };

    const fetchCentreOptions = async () => {
      await new Promise(r => setTimeout(r, 300)); // simulate delay
      setCentreOptions(['Noida', 'Pune', 'Bangalore', 'Lucknow', 'Patna', 'Indore']);
    };

    fetchBatchOptions();
    fetchCentreOptions();
  }, [studentData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingResume(true);
    try {
      // Mock upload, generate mock URL
      const mockUrl = `https://example.com/resumes/${user.uid}_${file.name}`;
      setFormData(prev => ({
        ...prev,
        resumeUrl: mockUrl,
      }));
      alert('Resume uploaded successfully! (Demo upload)');
    } catch (error) {
      console.error('Resume upload failed:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updateUser(user.uid, updatedData);

      if (onDataUpdate) {
        onDataUpdate({ ...studentData, ...updatedData });
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (studentData) {
      setFormData({
        name: studentData.name || '',
        enrollmentId: studentData.enrollmentId || studentData.rollNo || '',
        department: studentData.department || '',
        skills: studentData.skills || [],
        resumeUrl: studentData.resumeUrl || '',
        leetcodeProfile: studentData.leetcodeProfile || '',
        batch: studentData.batch || '',
        centre: studentData.centre || '',
      });
    }
    setIsEditing(false);
    setNewSkill('');
    setResumeFile(null);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl hover:from-orange-500 hover:to-amber-600 transition-all duration-200 shadow-lg"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-orange-700">Name</p>
            <p className="text-gray-900">{formData.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Enrollment ID</p>
            <p className="text-gray-900">{formData.enrollmentId || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Department</p>
            <p className="text-gray-900">{formData.department || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Batch</p>
            <p className="text-gray-900">{formData.batch || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Centre</p>
            <p className="text-gray-900">{formData.centre || 'Not provided'}</p>
          </div>
          {formData.skills && formData.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-sm rounded-full border border-orange-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {formData.resumeUrl && (
            <div>
              <p className="text-sm font-medium text-orange-700">Resume</p>
              <a
                href={formData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-orange-600 hover:text-orange-800 text-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                View Resume
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
          {formData.leetcodeProfile && (
            <div>
              <p className="text-sm font-medium text-orange-700">LeetCode Profile</p>
              <a
                href={formData.leetcodeProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-orange-600 hover:text-orange-800 text-sm"
              >
                {formData.leetcodeProfile}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCancel}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save size={16} className="mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        {/* Enrollment ID */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Enrollment ID *</label>
          <input
            type="text"
            value={formData.enrollmentId}
            onChange={(e) => handleInputChange('enrollmentId', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Enter your enrollment ID"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Department *</label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Chemical">Chemical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Batch */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Batch *</label>
          <select
            value={formData.batch}
            onChange={(e) => handleInputChange('batch', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          >
            <option value="">Select Batch</option>
            {batchOptions.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Centre */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Centre *</label>
          <select
            value={formData.centre}
            onChange={(e) => handleInputChange('centre', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          >
            <option value="">Select Centre</option>
            {centreOptions.map((centre) => (
              <option key={centre} value={centre}>
                {centre}
              </option>
            ))}
          </select>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 text-sm rounded-full border border-orange-200"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-orange-600 hover:text-red-600"
                  type="button"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Add a skill"
            />
            <button
              onClick={addSkill}
              className="px-3 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl hover:from-orange-500 hover:to-amber-600 transition-colors"
              type="button"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Resume</label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setResumeFile(file);
                  handleResumeUpload(file);
                }
              }}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              {uploadingResume ? (
                <div className="flex items-center text-orange-600">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <Upload size={20} className="mr-2" />
                  Upload Resume (PDF, DOC, DOCX - Max 5MB)
                </div>
              )}
            </label>
            {formData.resumeUrl && (
              <div className="flex items-center text-sm text-green-600">
                <FileText size={16} className="mr-1" />
                Resume uploaded successfully
              </div>
            )}
          </div>
        </div>

        {/* LeetCode Profile */}
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">LeetCode Profile</label>
          <input
            type="url"
            value={formData.leetcodeProfile}
            onChange={(e) => handleInputChange('leetcodeProfile', e.target.value)}
            className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="https://leetcode.com/your-username"
          />
        </div>
      </div>
    </div>
  );
};

export default EditableProfile;
