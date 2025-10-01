import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Calendar, Plus, X, Loader, ChevronDown, Upload } from 'lucide-react';
import JDUploader from './JDUploader';
import { saveJobDraft, postJob } from '../../../services/jobs';

// Utility functions
const toDDMMYYYY = (date) => {
  try {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return '';
  }
};

const CreateJob = ({ onCreated }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    company: '',
    jobTitle: '',
    jobType: '',
    jobLocation: '',
    experience: '',
    ctc: '',
    jobDescription: '',
    responsibilities: '',
    skills: [],
    applicationDeadline: '',
    spocs: [{ fullName: '', email: '', phone: '' }]
  });
  
  const [showJDUploader, setShowJDUploader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hiddenDateRef = useRef(null);

  // Handle JD upload and parsing
  const handleJDProcessed = (data) => {
    if (!data) return;
    
    const fieldMappings = {
      jobTitle: 'jobTitle',
      companyName: 'company',
      location: 'jobLocation',
      jobType: 'jobType',
      salary: 'ctc',
      experience: 'experience',
      jobDescription: 'jobDescription',
      responsibilities: 'responsibilities',
      skills: 'skills',
      applicationDeadline: 'applicationDeadline'
    };
    
    const updatedForm = { ...form };
    
    Object.entries(fieldMappings).forEach(([sourceField, targetField]) => {
      if (data[sourceField] !== undefined && data[sourceField] !== null) {
        if (targetField === 'skills' && typeof data[sourceField] === 'string') {
          updatedForm[targetField] = data[sourceField].split(',').map(s => s.trim());
        } else {
          updatedForm[targetField] = data[sourceField];
        }
      }
    });
    
    setForm(updatedForm);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle SPOC changes
  const updateSpoc = (index, field, value) => {
    const updatedSpocs = [...form.spocs];
    updatedSpocs[index] = { ...updatedSpocs[index], [field]: value };
    setForm(prev => ({
      ...prev,
      spocs: updatedSpocs
    }));
  };

  // Add new SPOC
  const addSpoc = () => {
    setForm(prev => ({
      ...prev,
      spocs: [...prev.spocs, { fullName: '', email: '', phone: '' }]
    }));
  };

  // Remove SPOC
  const removeSpoc = (index) => {
    if (form.spocs.length <= 1) return;
    const updatedSpocs = form.spocs.filter((_, i) => i !== index);
    setForm(prev => ({
      ...prev,
      spocs: updatedSpocs
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const jobData = {
        ...form,
        adminId: user?.uid,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      await postJob(jobData);
      if (onCreated) onCreated();
      
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      const jobData = {
        ...form,
        adminId: user?.uid,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      await saveJobDraft(jobData);
      alert('Draft saved successfully!');
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render form field
  const renderField = (label, name, type = 'text', required = false, placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name] || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* JD Uploader Modal */}
      {showJDUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <JDUploader 
              onFileProcessed={handleJDProcessed}
              onClose={() => setShowJDUploader(false)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Job Posting</h1>
        <button
          type="button"
          onClick={() => setShowJDUploader(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          <Upload size={16} />
          Upload Job Description
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Job Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Job Title', 'jobTitle', 'text', true, 'e.g., Senior Software Engineer')}
              {renderField('Company Name', 'company', 'text', true, 'e.g., Tech Corp Inc.')}
              {renderField('Job Type', 'jobType', 'text', true, 'e.g., Full-time, Part-time')}
              {renderField('Location', 'jobLocation', 'text', true, 'e.g., Bangalore, India')}
              {renderField('Experience', 'experience', 'text', true, 'e.g., 3-5 years')}
              {renderField('CTC/Salary', 'ctc', 'text', true, 'e.g., 10-15 LPA')}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter detailed job description..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={form.responsibilities || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List key responsibilities..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.skills?.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSkills = [...form.skills];
                          updatedSkills.splice(index, 1);
                          setForm(prev => ({ ...prev, skills: updatedSkills }));
                        }}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        const newSkill = e.target.value.trim();
                        if (!form.skills?.includes(newSkill)) {
                          setForm(prev => ({
                            ...prev,
                            skills: [...(prev.skills || []), newSkill]
                          }));
                        }
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a skill and press Enter"]');
                      if (input && input.value.trim()) {
                        const newSkill = input.value.trim();
                        if (!form.skills?.includes(newSkill)) {
                          setForm(prev => ({
                            ...prev,
                            skills: [...(prev.skills || []), newSkill]
                          }));
                        }
                        input.value = '';
                        input.focus();
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={form.applicationDeadline ? form.applicationDeadline.split('T')[0] : ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* SPOC Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contact Person (SPOC)</h2>
              <button
                type="button"
                onClick={addSpoc}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} /> Add SPOC
              </button>
            </div>
            
            {form.spocs?.map((spoc, index) => (
              <div key={index} className="mb-6 last:mb-0 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">SPOC {index + 1}</h3>
                  {form.spocs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpoc(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove SPOC"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={spoc.fullName || ''}
                      onChange={(e) => updateSpoc(index, 'fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={spoc.email || ''}
                      onChange={(e) => updateSpoc(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={spoc.phone || ''}
                      onChange={(e) => {
                        // Allow only numbers and limit to 10 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateSpoc(index, 'phone', value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
