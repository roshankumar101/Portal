import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getEducationalBackground, addEducationalBackground, updateEducationalBackground, deleteEducationalBackground } from '../../services/education';
import { Plus, Edit2, Save, X, GraduationCap, Trash2 } from 'lucide-react';

const EducationSection = () => {
  const { user } = useAuth();
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEducation, setNewEducation] = useState({
    instituteName: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    percentage: '',
    cgpa: ''
  });

  useEffect(() => {
    const fetchEducation = async () => {
      if (user?.uid) {
        try {
          const educationData = await getEducationalBackground(user.uid);
          setEducation(educationData);
        } catch (error) {
          console.error('Error fetching education:', error);
          setEducation([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEducation();
  }, [user]);

  const handleAddEducation = async () => {
    if (newEducation.instituteName.trim() && user?.uid) {
      try {
        const educationId = await addEducationalBackground(user.uid, {
          ...newEducation,
          startYear: parseInt(newEducation.startYear),
          endYear: parseInt(newEducation.endYear),
          percentage: newEducation.percentage ? parseFloat(newEducation.percentage) : null,
          cgpa: newEducation.cgpa ? parseFloat(newEducation.cgpa) : null
        });
        const newEducationWithId = { ...newEducation, id: educationId };
        setEducation([...education, newEducationWithId]);
        setNewEducation({
          instituteName: '',
          degree: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
          percentage: '',
          cgpa: ''
        });
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding education:', error);
        alert('Failed to add education. Please try again.');
      }
    }
  };

  const handleEditEducation = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = async (index, updatedEducation) => {
    try {
      await updateEducationalBackground(education[index].id, {
        ...updatedEducation,
        startYear: parseInt(updatedEducation.startYear),
        endYear: parseInt(updatedEducation.endYear),
        percentage: updatedEducation.percentage ? parseFloat(updatedEducation.percentage) : null,
        cgpa: updatedEducation.cgpa ? parseFloat(updatedEducation.cgpa) : null
      });
      const updatedEducationList = [...education];
      updatedEducationList[index] = { ...updatedEducation, id: education[index].id };
      setEducation(updatedEducationList);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating education:', error);
      alert('Failed to update education. Please try again.');
    }
  };

  const handleDeleteEducation = async (index) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        await deleteEducationalBackground(education[index].id);
        const updatedEducation = education.filter((_, i) => i !== index);
        setEducation(updatedEducation);
      } catch (error) {
        console.error('Error deleting education:', error);
        alert('Failed to delete education record. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewEducation({
      instituteName: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      percentage: '',
      cgpa: ''
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Educational Background
          </legend>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading education...</div>
          </div>
        </fieldset>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-200">
        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Education</h2>
        
        {/* Add Education Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </button>
        </div>

        {/* Add New Education Form */}
        {isAdding && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Add Educational Background</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                <input
                  type="text"
                  value={newEducation.instituteName}
                  onChange={(e) => setNewEducation({...newEducation, instituteName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter institute name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bachelor of Technology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={newEducation.fieldOfStudy}
                  onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Computer Science Engineering"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                  <input
                    type="number"
                    value={newEducation.startYear}
                    onChange={(e) => setNewEducation({...newEducation, startYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2021"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                  <input
                    type="number"
                    value={newEducation.endYear}
                    onChange={(e) => setNewEducation({...newEducation, endYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2025"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                <input
                  type="number"
                  step="0.01"
                  value={newEducation.percentage}
                  onChange={(e) => setNewEducation({...newEducation, percentage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={newEducation.cgpa}
                  onChange={(e) => setNewEducation({...newEducation, cgpa: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8.5"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleAddEducation}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Education
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Education Table */}
        {education.length > 0 && (
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="font-semibold text-gray-900">Institute</div>
              <div className="font-semibold text-gray-900">Qualification</div>
              <div className="font-semibold text-gray-900">Year of Passing</div>
              <div className="font-semibold text-gray-900">CGPA/Percentage</div>
              <div className="font-semibold text-gray-900">Actions</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-2 mt-2">
              {education.map((edu, index) => (
                <EducationRow
                  key={index}
                  education={edu}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={() => handleEditEducation(index)}
                  onSave={(updatedEducation) => handleSaveEdit(index, updatedEducation)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteEducation(index)}
                />
              ))}
            </div>
          </div>
        )}

        {education.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-500">
            No education records found. Click "Add Education" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

// EducationRow Component for table display
const EducationRow = ({ education, index, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [editData, setEditData] = useState({
    instituteName: education.instituteName || '',
    degree: education.degree || '',
    fieldOfStudy: education.fieldOfStudy || '',
    startYear: education.startYear || '',
    endYear: education.endYear || '',
    percentage: education.percentage || '',
    cgpa: education.cgpa || ''
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        instituteName: education.instituteName || '',
        degree: education.degree || '',
        fieldOfStudy: education.fieldOfStudy || '',
        startYear: education.startYear || '',
        endYear: education.endYear || '',
        percentage: education.percentage || '',
        cgpa: education.cgpa || ''
      });
    }
  }, [isEditing, education]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
        <h4 className="text-lg font-bold text-gray-900 mb-3">Edit Educational Background</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
            <input
              type="text"
              value={editData.instituteName}
              onChange={(e) => setEditData({...editData, instituteName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input
              type="text"
              value={editData.degree}
              onChange={(e) => setEditData({...editData, degree: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
            <input
              type="text"
              value={editData.fieldOfStudy}
              onChange={(e) => setEditData({...editData, fieldOfStudy: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
              <input
                type="number"
                value={editData.startYear}
                onChange={(e) => setEditData({...editData, startYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
              <input
                type="number"
                value={editData.endYear}
                onChange={(e) => setEditData({...editData, endYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
            <input
              type="number"
              step="0.01"
              value={editData.percentage}
              onChange={(e) => setEditData({...editData, percentage: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
            <input
              type="number"
              step="0.01"
              value={editData.cgpa}
              onChange={(e) => setEditData({...editData, cgpa: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Determine qualification display
  const qualification = education.fieldOfStudy ? education.fieldOfStudy : education.degree;
  
  // Determine CGPA/Percentage display
  const gradeDisplay = education.cgpa 
    ? `${education.cgpa} CGPA` 
    : education.percentage 
      ? `${education.percentage}%` 
      : 'N/A';

  return (
    <div className="grid grid-cols-5 gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
      <div className="font-medium text-gray-900">{education.instituteName}</div>
      <div className="text-gray-700">{qualification}</div>
      <div className="text-gray-700">{education.endYear}</div>
      <div className="text-gray-700">{gradeDisplay}</div>
      
      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="p-1 text-blue-600 hover:bg-blue-200 rounded transition-colors duration-200"
          title="Edit Education"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-red-600 hover:bg-red-200 rounded transition-colors duration-200"
          title="Delete Education"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EducationSection;
