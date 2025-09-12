import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Download, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Move, 
  Palette, 
  Type, 
  Layout,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  Heart,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
// Removed drag-and-drop dependency to prevent cascade errors
import ResumePreview from './ResumePreview';
import { saveResumeData, getResumeData } from '../../services/resumeData';
import { ExperienceForm, EducationForm } from './SectionForms';

const SECTION_TYPES = {
  PERSONAL: 'personal',
  SUMMARY: 'summary',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications',
  LANGUAGES: 'languages',
  INTERESTS: 'interests',
  CUSTOM: 'custom'
};

const SECTION_ICONS = {
  [SECTION_TYPES.PERSONAL]: User,
  [SECTION_TYPES.SUMMARY]: FileText,
  [SECTION_TYPES.EXPERIENCE]: Briefcase,
  [SECTION_TYPES.EDUCATION]: GraduationCap,
  [SECTION_TYPES.SKILLS]: Code,
  [SECTION_TYPES.PROJECTS]: Layout,
  [SECTION_TYPES.CERTIFICATIONS]: Award,
  [SECTION_TYPES.LANGUAGES]: Languages,
  [SECTION_TYPES.INTERESTS]: Heart,
  [SECTION_TYPES.CUSTOM]: Plus
};

const DEFAULT_RESUME_DATA = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  sections: [
    { id: 'experience', type: SECTION_TYPES.EXPERIENCE, title: 'Work Experience', items: [] },
    { id: 'education', type: SECTION_TYPES.EDUCATION, title: 'Education', items: [] },
    { id: 'skills', type: SECTION_TYPES.SKILLS, title: 'Skills', items: [] },
    { id: 'projects', type: SECTION_TYPES.PROJECTS, title: 'Projects', items: [] }
  ],
  settings: {
    template: 'modern',
    fontSize: 'medium',
    color: '#2563eb',
    spacing: 'normal'
  }
};

export default function CustomResumeBuilder({ userId }) {
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const autoSaveRef = useRef(null);

  useEffect(() => {
    loadResumeData();
  }, [userId]);

  useEffect(() => {
    // Auto-save after 2 seconds of inactivity
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    autoSaveRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [resumeData]);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      const data = await getResumeData(userId);
      if (data) {
        setResumeData({ ...DEFAULT_RESUME_DATA, ...data });
      }
    } catch (error) {
      console.error('Error loading resume data:', error);
      setSaveStatus({ type: 'error', message: 'Failed to load resume data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (loading) return;
    
    try {
      await saveResumeData(userId, resumeData);
      setSaveStatus({ type: 'success', message: 'Auto-saved' });
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleManualSave = async () => {
    try {
      setSaving(true);
      await saveResumeData(userId, resumeData);
      setSaveStatus({ type: 'success', message: 'Resume saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus({ type: 'error', message: 'Failed to save resume' });
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const updateSection = (sectionId, updates) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const addSectionItem = (sectionId, item) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, { ...item, id: Date.now().toString() }] }
          : section
      )
    }));
  };

  const updateSectionItem = (sectionId, itemId, updates) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : section
      )
    }));
  };

  const deleteSectionItem = (sectionId, itemId) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, items: section.items.filter(item => item.id !== itemId) }
          : section
      )
    }));
  };

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      type: SECTION_TYPES.CUSTOM,
      title: 'New Section',
      items: []
    };
    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setActiveSection(newSection.id);
  };

  const deleteSection = (sectionId) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    if (activeSection === sectionId) {
      setActiveSection('personal');
    }
  };

  const moveSectionUp = (sectionId) => {
    const sectionIndex = resumeData.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex <= 0) return;

    const newSections = [...resumeData.sections];
    [newSections[sectionIndex - 1], newSections[sectionIndex]] = 
    [newSections[sectionIndex], newSections[sectionIndex - 1]];

    setResumeData(prev => ({
      ...prev,
      sections: newSections
    }));
  };

  const moveSectionDown = (sectionId) => {
    const sectionIndex = resumeData.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex >= resumeData.sections.length - 1) return;

    const newSections = [...resumeData.sections];
    [newSections[sectionIndex], newSections[sectionIndex + 1]] = 
    [newSections[sectionIndex + 1], newSections[sectionIndex]];

    setResumeData(prev => ({
      ...prev,
      sections: newSections
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading resume builder...</span>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit3 className="h-4 w-4 mr-2 inline" />
              Edit
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Download PDF
            </button>
          </div>
        </div>
        <ResumePreview resumeData={resumeData} />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Resume Builder</h2>
            {saveStatus && (
              <div className={`flex items-center text-sm ${
                saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {saveStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {saveStatus.message}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualSave}
              disabled={saving}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {saving ? (
                <Loader className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1 inline" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-1">
              {/* Personal Info */}
              <button
                onClick={() => setActiveSection('personal')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md text-sm ${
                  activeSection === 'personal'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Personal Information
              </button>

              {/* Summary */}
              <button
                onClick={() => setActiveSection('summary')}
                className={`w-full flex items-center px-3 py-2 text-left rounded-md text-sm ${
                  activeSection === 'summary'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Professional Summary
              </button>

              {/* Sections */}
              <div>
                {resumeData.sections.map((section, index) => {
                  const IconComponent = SECTION_ICONS[section.type] || Layout;
                  return (
                    <div key={section.id} className="flex items-center group">
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-1 flex items-center px-3 py-2 text-left rounded-md text-sm ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {section.title}
                        <span className="ml-auto text-xs text-gray-400">
                          {section.items?.length || 0}
                        </span>
                      </button>
                      <div className="flex items-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => moveSectionUp(section.id)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move Up"
                        >
                          <Move className="h-3 w-3 rotate-180" />
                        </button>
                        <button
                          onClick={() => moveSectionDown(section.id)}
                          disabled={index === resumeData.sections.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move Down"
                        >
                          <Move className="h-3 w-3" />
                        </button>
                        {section.type === SECTION_TYPES.CUSTOM && (
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete Section"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Section */}
              <button
                onClick={addCustomSection}
                className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm text-gray-500 hover:bg-gray-100 border-2 border-dashed border-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Section
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Customization</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Palette className="h-4 w-4 mr-2" />
              Colors & Theme
            </button>
            <button className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </button>
            <button className="w-full flex items-center px-3 py-2 text-left rounded-md text-sm text-gray-600 hover:bg-gray-100">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Form Editor */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {activeSection === 'personal' && (
            <PersonalInfoForm
              data={resumeData.personal}
              onChange={updatePersonalInfo}
            />
          )}
          {activeSection === 'summary' && (
            <SummaryForm
              data={resumeData.summary}
              onChange={updateSummary}
            />
          )}
          {resumeData.sections.map(section => (
            activeSection === section.id && (
              <div key={section.id}>
                {section.type === SECTION_TYPES.EXPERIENCE && (
                  <ExperienceForm
                    items={section.items}
                    onAddItem={addSectionItem}
                    onUpdateItem={updateSectionItem}
                    onDeleteItem={deleteSectionItem}
                    sectionId={section.id}
                  />
                )}
                {section.type === SECTION_TYPES.EDUCATION && (
                  <EducationForm
                    items={section.items}
                    onAddItem={addSectionItem}
                    onUpdateItem={updateSectionItem}
                    onDeleteItem={deleteSectionItem}
                    sectionId={section.id}
                  />
                )}
                {(section.type === SECTION_TYPES.SKILLS || 
                  section.type === SECTION_TYPES.PROJECTS || 
                  section.type === SECTION_TYPES.CERTIFICATIONS ||
                  section.type === SECTION_TYPES.LANGUAGES ||
                  section.type === SECTION_TYPES.INTERESTS ||
                  section.type === SECTION_TYPES.CUSTOM) && (
                  <SectionForm
                    section={section}
                    onUpdateSection={updateSection}
                    onAddItem={addSectionItem}
                    onUpdateItem={updateSectionItem}
                    onDeleteItem={deleteSectionItem}
                  />
                )}
              </div>
            )
          ))}
        </div>

        {/* Live Preview */}
        <div className="w-1/2 border-l border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
          </div>
          <div className="p-4 h-full overflow-y-auto">
            <ResumePreview resumeData={resumeData} scale={0.75} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Info Form Component
function PersonalInfoForm({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, State, Country"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={data.website}
                onChange={(e) => onChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={data.linkedin}
                onChange={(e) => onChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub
              </label>
              <input
                type="url"
                value={data.github}
                onChange={(e) => onChange('github', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Form Component
function SummaryForm({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Summary
          </label>
          <textarea
            value={data}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
          />
          <p className="text-xs text-gray-500 mt-1">
            2-3 sentences that summarize your professional background and key strengths.
          </p>
        </div>
      </div>
    </div>
  );
}

// Section Form Component (placeholder - will be expanded)
function SectionForm({ section, onUpdateSection, onAddItem, onUpdateItem, onDeleteItem }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
        <p className="text-gray-600 mb-4">
          Manage your {section.title.toLowerCase()} entries.
        </p>
        <button
          onClick={() => onAddItem(section.id, { title: '', description: '' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Add {section.title.slice(0, -1)}
        </button>
      </div>
    </div>
  );
}
