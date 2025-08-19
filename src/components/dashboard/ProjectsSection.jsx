import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/projects';
import { ExternalLink, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';

const ProjectsSection = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProject, setNewProject] = useState({
    projectName: '',
    description: '',
    projectUrl: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.uid) {
        try {
          const studentProjects = await getProjects(user.uid);
          setProjects(studentProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user]);

  const handleAddProject = async () => {
    if (newProject.projectName.trim() && user?.uid) {
      try {
        const projectId = await addProject(user.uid, newProject);
        const newProjectWithId = { ...newProject, id: projectId };
        setProjects([...projects, newProjectWithId]);
        setNewProject({ projectName: '', description: '', projectUrl: '' });
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Failed to add project. Please try again.');
      }
    }
  };

  const handleEditProject = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = async (index, updatedProject) => {
    try {
      await updateProject(projects[index].id, updatedProject);
      const updatedProjects = [...projects];
      updatedProjects[index] = { ...updatedProject, id: projects[index].id };
      setProjects(updatedProjects);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  const handleDeleteProject = async (index) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projects[index].id);
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setNewProject({ projectName: '', description: '', projectUrl: '' });
  };

  if (loading) {
    return (
      <div className="w-full">
        <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6">
          <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
            Project Details
          </legend>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading projects...</div>
          </div>
        </fieldset>
      </div>
    );
  }

  return (
    <div className="w-full">
      <fieldset className="bg-white rounded-2xl border-2 border-blue-200 p-6 transition-all duration-200">
        <legend className="text-xl font-bold text-blue-600 px-4 bg-blue-100 rounded-full">
          Project Details
        </legend>
        
        <div className="my-3">
          {/* Add Project Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </button>
          </div>

          {/* Scrollable container */}
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 pr-2">
            <div className="space-y-2">
              {/* Add New Project Form */}
              {isAdding && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Add New Project</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={newProject.projectName}
                        onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Describe your project"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                      <input
                        type="url"
                        value={newProject.projectUrl}
                        onChange={(e) => setNewProject({...newProject, projectUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddProject}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Project
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

              {/* Existing Projects */}
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  isEditing={editingIndex === index}
                  onEdit={() => handleEditProject(index)}
                  onSave={(updatedProject) => handleSaveEdit(index, updatedProject)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteProject(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

// ProjectCard Component
const ProjectCard = ({ project, index, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [editData, setEditData] = useState(project);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
        <h4 className="text-lg font-bold text-gray-900 mb-3">Edit Project</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={editData.projectName}
              onChange={(e) => setEditData({...editData, projectName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
            <input
              type="url"
              value={editData.projectUrl}
              onChange={(e) => setEditData({...editData, projectUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex-shrink-0">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-bold text-gray-900">{project.projectName}</h4>
        <div className="flex space-x-1">
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
      
      <div className="mb-3">
        <span className="font-semibold text-gray-800">Project Description: </span>
        <span className="text-sm text-gray-700 leading-relaxed">
          {project.description}
        </span>
      </div>
      
      <div>
        <span className="font-semibold text-gray-800">Project URL: </span>
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View Project
        </a>
      </div>
    </div>
  );
};

export default ProjectsSection;
