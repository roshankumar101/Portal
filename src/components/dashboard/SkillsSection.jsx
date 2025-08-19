import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../../services/skills';

const SkillsSection = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    rating: 1
  });

  useEffect(() => {
    const fetchSkills = async () => {
      if (user?.uid) {
        try {
          const studentSkills = await getSkills(user.uid);
          setSkills(studentSkills);
        } catch (error) {
          console.error('Error fetching skills:', error);
          setSkills([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSkills();
  }, [user]);

  const handleAddSkill = async () => {
    if (newSkill.skillName.trim() && user?.uid) {
      try {
        const skillId = await addSkill(user.uid, newSkill);
        const newSkillWithId = { ...newSkill, id: skillId };
        setSkills([...skills, newSkillWithId]);
        setNewSkill({ skillName: '', rating: 1 });
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding skill:', error);
        alert('Failed to add skill. Please try again.');
      }
    }
  };

  const handleEditSkill = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = async (index, updatedSkill) => {
    try {
      await updateSkill(skills[index].id, updatedSkill);
      const updatedSkills = [...skills];
      updatedSkills[index] = { ...updatedSkill, id: skills[index].id };
      setSkills(updatedSkills);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (index) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skills[index].id);
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewSkill({ skillName: '', rating: 1 });
  };

  if (loading) {
    return (
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Skills
          </legend>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading skills...</div>
          </div>
        </fieldset>
      </div>
    );
  }

  const StarRating = ({ rating, onRatingChange, editable = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 transition-colors duration-200 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } ${editable ? 'cursor-pointer hover:scale-110' : ''}`}
            onClick={() => editable && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Skills
        </legend>
        
        <div className="my-3">
          {/* Add Skill Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </button>
          </div>

          {/* Add New Skill Form */}
          {isAdding && (
            <div className="mb-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Add New Skill</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter skill name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5 stars)</label>
                  <StarRating 
                    rating={newSkill.rating} 
                    onRatingChange={(rating) => setNewSkill({...newSkill, rating})}
                    editable={true}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddSkill}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Skill
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
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - First half of skills */}
            <div className="space-y-3">
              {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, index) => (
                <SkillCard
                  key={index}
                  skill={skill}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={() => handleEditSkill(index)}
                  onSave={(updatedSkill) => handleSaveEdit(index, updatedSkill)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteSkill(index)}
                  StarRating={StarRating}
                />
              ))}
            </div>
            
            {/* Right Column - Second half of skills */}
            <div className="space-y-3">
              {skills.slice(Math.ceil(skills.length / 2)).map((skill, index) => (
                <SkillCard
                  key={index + Math.ceil(skills.length / 2)}
                  skill={skill}
                  index={index + Math.ceil(skills.length / 2)}
                  isEditing={editingIndex === (index + Math.ceil(skills.length / 2))}
                  onEdit={() => handleEditSkill(index + Math.ceil(skills.length / 2))}
                  onSave={(updatedSkill) => handleSaveEdit(index + Math.ceil(skills.length / 2), updatedSkill)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteSkill(index + Math.ceil(skills.length / 2))}
                  StarRating={StarRating}
                />
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

// SkillCard Component
const SkillCard = ({ skill, index, isEditing, onEdit, onSave, onCancel, onDelete, StarRating }) => {
  const [editData, setEditData] = useState(skill);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
        <h4 className="text-lg font-bold text-gray-900 mb-3">Edit Skill</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input
              type="text"
              value={editData.skillName}
              onChange={(e) => setEditData({...editData, skillName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5 stars)</label>
            <StarRating 
              rating={editData.rating} 
              onRatingChange={(rating) => setEditData({...editData, rating})}
              editable={true}
            />
          </div>
          
          <div className="flex space-x-2">
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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <span className="text-base font-semibold text-gray-900">{skill.skillName}</span>
        <div className="ml-2 flex space-x-1">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <StarRating rating={skill.rating} />
      </div>
    </div>
  );
};

export default SkillsSection;
