import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Calendar, Info, Plus, X, Loader, ChevronUp, ChevronDown } from 'lucide-react';

// Utility helpers
const toISOFromDDMMYYYY = (val) => {
  // expects DD/MM/YYYY; returns ISO string or ''
  if (!val) return '';
  const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  const [_, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(d.getTime()) ? '' : d.toISOString();
};

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

const DRIVE_VENUES = [
  'PW IOI Campus, Bangalore',
  'PW IOI Campus, Pune',
  'PW IOI Campus, Noida',
  'PW IOI Campus, Lucknow',
  'Company Premises',
];

export default function CreateJob({ onCreated }) {
  const { user } = useAuth();
  const [posting, setPosting] = useState(false);
  const [showVenues, setShowVenues] = useState(false);
  const hiddenDateRef = useRef(null);
  const [websiteError, setWebsiteError] = useState('');
  const [savedPositions, setSavedPositions] = useState([]); // locally saved (company, jobTitle)
  const [selectedPositions, setSelectedPositions] = useState(new Set()); // track which positions are selected
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [gapInputMode, setGapInputMode] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({ serviceAgreement: false, blockingPeriod: false });

  // Form state
  const [form, setForm] = useState({
    company: '',
    website: '',
    jobType: 'Internship', // Internship | Full-Time
    stipend: '', // internship
    duration: '', // internship
    salary: '', // full-time (CTC)
    jobTitle: '',
    workMode: 'On-site', // On-site | Hybrid | Remote
    companyLocation: '',
    openings: '', // admin-only
    responsibilities: '',
    // Company SPOC fields
    spocFullName: '',
    spocEmail: '',
    spocPhone: '',
    driveDateText: '', // DD/MM/YYYY for manual input
    driveDateISO: '',  // ISO for payload
    driveVenues: [],   // multi-select
    qualification: '',
    specialization: '',
    yop: '', // year of passing
    minCgpa: '',
    skillsInput: '', // raw input to turn into chips
    skills: [],
    gapAllowed: 'Not Allowed', // Allowed | Not Allowed
    gapYears: '', // only if allowed
    backlogs: 'Not Allowed', // Allowed | Not Allowed
    serviceAgreement: '',
    blockingPeriod: '',
    // Interview rounds: we store base and extra details separately, but will combine on submit
    baseRoundDetails: ['', '', ''], // for I, II, III Round respectively
    extraRounds: [], // [{ title: 'Round 4', detail: '' }, ...]
    instructions: '',
  });

  // Local draft for About Drive section (so Save stores into main form, Cancel clears this subset)
  const [driveDraft, setDriveDraft] = useState({
    driveDateText: '',
    driveDateISO: '',
    driveVenues: [],
  });

  // Section completion checks
  const isCompanyDetailsComplete = useMemo(() => {
    const base = form.company?.trim() && form.jobTitle?.trim() && form.companyLocation?.trim() && form.website?.trim() && form.workMode?.trim();
    const comp = form.jobType === 'Internship'
      ? form.stipend?.trim() && form.duration?.trim()
      : form.salary?.trim();
    const websiteOk = !form.website?.trim() || isValidUrl(form.website.trim());
    return !!(base && comp && websiteOk);
  }, [form]);

  const isDriveDetailsComplete = useMemo(() => {
    return !!(form.driveDateISO || toISOFromDDMMYYYY(form.driveDateText)) && form.driveVenues.length > 0;
  }, [form.driveDateISO, form.driveDateText, form.driveVenues]);

  const isSkillsEligibilityComplete = useMemo(() => {
    return form.qualification?.trim() && form.yop?.trim() && form.minCgpa?.trim() && form.skills.length > 0;
  }, [form.qualification, form.yop, form.minCgpa, form.skills]);

  // Interview process validation
  const isInterviewProcessComplete = useMemo(() => {
    return form.baseRoundDetails[0]?.trim() && form.baseRoundDetails[1]?.trim() && form.baseRoundDetails[2]?.trim();
  }, [form.baseRoundDetails]);

  // Derived validations
  const canPost = useMemo(() => {
    return isCompanyDetailsComplete && isDriveDetailsComplete && isSkillsEligibilityComplete && isInterviewProcessComplete;
  }, [isCompanyDetailsComplete, isDriveDetailsComplete, isSkillsEligibilityComplete, isInterviewProcessComplete]);

  // Handlers
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  // URL validation (http/https) - function declaration so it's hoisted
  function isValidUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  const onWebsiteChange = (value) => {
    update({ website: value });
    if (!value) {
      setWebsiteError('');
      return;
    }
    setWebsiteError(isValidUrl(value) ? '' : 'Enter a valid URL starting with http(s)://');
  };

  const onJobTypeChange = (val) => {
    update({ jobType: val });
  };

  const onSkillsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = form.skillsInput?.trim().replace(/,$/, '') || '';
      if (!value) return;
      const pieces = value
        .split(',')
        .map((s) => s?.trim())
        .filter(Boolean);
      update({ skills: Array.from(new Set([...form.skills, ...pieces])), skillsInput: '' });
    }
  };

  const removeSkill = (idx) => {
    const next = [...form.skills];
    next.splice(idx, 1);
    update({ skills: next });
  };

  const addRound = () => {
    const count = form.extraRounds.length + 4; // starts from Round 4
    update({ extraRounds: [...form.extraRounds, { title: `Round ${count}`, detail: '' }] });
  };
  const removeExtraRound = (idx) => {
    const next = [...form.extraRounds];
    next.splice(idx, 1);
    update({ extraRounds: next });
  };
  const updateBaseRoundDetail = (idx, val) => {
    const next = [...form.baseRoundDetails];
    next[idx] = val;
    update({ baseRoundDetails: next });
  };
  const updateExtraRoundDetail = (idx, val) => {
    const next = [...form.extraRounds];
    next[idx] = { ...next[idx], detail: val };
    update({ extraRounds: next });
  };

  const onPickDate = (e) => {
    const iso = e.target.value ? new Date(e.target.value).toISOString() : '';
    const text = e.target.value ? toDDMMYYYY(e.target.value) : '';
    setDriveDraft((d) => ({ ...d, driveDateISO: iso, driveDateText: text }));
    update({ driveDateISO: iso, driveDateText: text });
  };

  const onDriveDateText = (val) => {
    const iso = toISOFromDDMMYYYY(val);
    setDriveDraft((d) => ({ ...d, driveDateText: val, driveDateISO: iso }));
    update({ driveDateText: val, driveDateISO: iso });
  };

  const toggleVenue = (venue) => {
    const selected = new Set(driveDraft.driveVenues);
    if (selected.has(venue)) selected.delete(venue);
    else selected.add(venue);
    const arr = Array.from(selected);
    setDriveDraft((d) => ({ ...d, driveVenues: arr }));
    update({ driveVenues: arr });
  };

  // About Drive section now updates the main form immediately; no Save/Cancel buttons
  
  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isSectionCollapsed = (sectionId) => collapsedSections.has(sectionId);
  
  const canShowSection = (sectionId) => {
    switch (sectionId) {
      case 'company': return true;
      case 'drive': return isCompanyDetailsComplete;
      case 'skills': return isCompanyDetailsComplete && isDriveDetailsComplete;
      case 'interview': return isCompanyDetailsComplete && isDriveDetailsComplete && isSkillsEligibilityComplete;
      default: return true;
    }
  };

  const resetForm = (keep = {}) => {
    setForm((f) => ({
      company: keep.company ?? '',
      website: keep.website ?? '',
      jobType: 'Internship',
      stipend: '',
      duration: '',
      salary: '',
      jobTitle: '',
      workMode: 'On-site',
      companyLocation: keep.companyLocation ?? '',
      openings: '',
      responsibilities: '',
      driveDateText: '',
      driveDateISO: '',
      driveVenues: [],
      qualification: '',
      specialization: '',
      yop: '',
      minCgpa: '',
      skillsInput: '',
      skills: [],
      gapAllowed: 'Not Allowed',
      gapYears: '',
      backlogs: 'Not Allowed',
      serviceAgreement: keep.serviceAgreement ?? '',
      blockingPeriod: '',
      // reset interview rounds state
      baseRoundDetails: ['', '', ''],
      extraRounds: [],
      instructions: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canPost) return;
    try {
      setPosting(true);
      const payload = {
        ...form,
        driveDate: form.driveDateISO || toISOFromDDMMYYYY(form.driveDateText) || null,
        adminId: user?.uid || null,
        createdAt: new Date().toISOString(),
        interviewRounds: [
          { title: 'I Round', detail: form.baseRoundDetails[0] },
          { title: 'II Round', detail: form.baseRoundDetails[1] },
          { title: 'III Round', detail: form.baseRoundDetails[2] },
          ...form.extraRounds,
        ],
      };
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to post job');
      if (onCreated) onCreated();
      alert('Job posted successfully');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to post job: ' + (err?.message || 'Unknown error'));
    } finally {
      setPosting(false);
    }
  };

  const cloneForAnother = () => {
    if (!canPost) return;
    // Validate website if provided
    if (form.website?.trim() && !isValidUrl(form.website.trim())) {
      setWebsiteError('Enter a valid URL starting with http(s)://');
      return;
    }
    // Save summary of current position locally
    const companyName = form.company?.trim();
    const jobTitle = form.jobTitle?.trim();
    const jobType = form.jobType;
    const workMode = form.workMode;
    if (companyName && jobTitle) {
      const newPositionIndex = savedPositions.length;
      setSavedPositions((list) => [...list, { 
        company: companyName, 
        jobTitle, 
        jobType, 
        workMode 
      }]);
      // Auto-select the new position
      setSelectedPositions(prev => new Set([...prev, newPositionIndex]));
    }
    // Reset while cloning certain fields for faster next entry
    resetForm({
      company: form.company,
      website: form.website,
      serviceAgreement: form.serviceAgreement,
      companyLocation: form.companyLocation,
    });
    // Clear drive details for new position
    setDriveDraft({
      driveDateText: '',
      driveDateISO: '',
      driveVenues: [],
    });
    // Keep sections expanded for easy multiple entries
    setCollapsedSections(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
        <p className="text-sm text-slate-600">Please fill the following details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-4 space-y-6">
        {/* Section 1: Company Details */}
        <section className="space-y-4 border-b-[1.5px] border-gray-700 pb-6 mb-6">
          <h3 className="text-lg font-semibold">Company Details</h3>
          
          {!isSectionCollapsed('company') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black font-medium">Company:</label>
                  <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.company?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. ABC Corp" value={form.company} onChange={(e) => update({ company: e.target.value })} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-blue-600 font-medium">Website:</label>
                  <input className={`border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-700 placeholder:text-gray-400 ${websiteError ? 'border-red-400 bg-red-50' : form.website?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="https://company.com" value={form.website} onChange={(e) => onWebsiteChange(e.target.value)} required />
                  {websiteError && <p className="text-xs text-red-600 mt-1">{websiteError}</p>}
                </div>
              </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Job Type:</label>
              <select className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.jobType ? 'bg-green-100' : 'bg-gray-100'}`} value={form.jobType} onChange={(e) => onJobTypeChange(e.target.value)}>
                <option>Internship</option>
                <option>Full-Time</option>
              </select>
            </div>

            {form.jobType === 'Internship' ? (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black font-medium">Stipend:</label>
                  <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.stipend?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="₹ per month (e.g. 15000)" value={form.stipend} onChange={(e) => update({ stipend: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black font-medium">Duration:</label>
                  <input className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 ${form.duration?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. 6 months" value={form.duration} onChange={(e) => update({ duration: e.target.value })} />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-sm text-black font-medium">Salary (CTC):</label>
                <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.salary?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="₹ per annum (e.g. 12,00,000)" value={form.salary} onChange={(e) => update({ salary: e.target.value })} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Job Title:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.jobTitle?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. Full Stack Developer" value={form.jobTitle} onChange={(e) => update({ jobTitle: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Work Mode:</label>
              <select className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.workMode ? 'bg-green-100' : 'bg-gray-100'}`} value={form.workMode} onChange={(e) => update({ workMode: e.target.value })} required>
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm text-black font-medium">Company Location:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.companyLocation?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="City, State (e.g. Bangalore, Karnataka)" value={form.companyLocation} onChange={(e) => update({ companyLocation: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Open Positions (Internal Details):</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.openings?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. 5 (optional)" value={form.openings} onChange={(e) => update({ openings: e.target.value })} />
            </div>
          </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Roles & Responsibilities:</label>
                <textarea 
                  className={`border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[120px] max-h-[300px] resize-y ${form.responsibilities?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} 
                  placeholder="Outline responsibilities, tech stack, team, etc. (optional)" 
                  value={form.responsibilities} 
                  onChange={(e) => update({ responsibilities: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const textarea = e.target;
                      const cursorPosition = textarea.selectionStart;
                      const textBefore = textarea.value.substring(0, cursorPosition);
                      const textAfter = textarea.value.substring(cursorPosition);
                      
                      // Check if we're at the beginning of a line or after a bullet point
                      const lines = textBefore.split('\n');
                      const currentLine = lines[lines.length - 1];
                      
                      let newText;
                      if (currentLine?.trim() === '' || currentLine?.trim() === '•') {
                        // If current line is empty or just a bullet, add a new bullet point
                        newText = textBefore + '\n• ' + textAfter;
                      } else if (currentLine.startsWith('• ')) {
                        // If current line already has a bullet, add a new bullet point
                        newText = textBefore + '\n• ' + textAfter;
                      } else {
                        // If current line doesn't have a bullet, convert it to a bullet point and add new one
                        const updatedCurrentLine = '• ' + currentLine;
                        const updatedLines = [...lines.slice(0, -1), updatedCurrentLine];
                        newText = updatedLines.join('\n') + '\n• ' + textAfter;
                      }
                      
                      update({ responsibilities: newText });
                      
                      // Set cursor position after the new bullet point
                      setTimeout(() => {
                        const newCursorPosition = newText.length - textAfter.length;
                        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
                      }, 0);
                    }
                  }}
                />
              </div>

              {/* Company SPOC Subsection */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-800 mb-4">Company SPOC</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Full Name:</label>
                    <input 
                      className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.spocFullName?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} 
                      placeholder="e.g. Amit Kumar" 
                      value={form.spocFullName} 
                      onChange={(e) => update({ spocFullName: e.target.value })} 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Email ID:</label>
                    <input 
                      type="email"
                      className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.spocEmail?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} 
                      placeholder="e.g. amit.kumar@company.com" 
                      value={form.spocEmail} 
                      onChange={(e) => update({ spocEmail: e.target.value })} 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Phone Number:</label>
                    <input 
                      type="tel"
                      className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.spocPhone?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} 
                      placeholder="e.g. +91 9876543210" 
                      value={form.spocPhone} 
                      onChange={(e) => update({ spocPhone: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {isCompanyDetailsComplete && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toggleSection('company')}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-200 rounded-md"
                title={isSectionCollapsed('company') ? 'Expand section' : 'Minimize section'}
              >
                {isSectionCollapsed('company') ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
              </button>
            </div>
          )}
        </section>

        {/* Section 2: About Drive */}
        <section className="space-y-4 border-b-[1.5px] border-gray-600 pb-6 mb-6">
          <h3 className="text-lg font-semibold">About Drive</h3>
          
          {canShowSection('drive') && !isSectionCollapsed('drive') ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Drive Date:</label>
              <div className="relative">
                <input
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 ${driveDraft.driveDateText?.trim() ? 'bg-green-100' : 'bg-gray-100'}`}
                  placeholder="DD/MM/YYYY"
                  value={driveDraft.driveDateText || ''}
                  onChange={(e) => onDriveDateText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => hiddenDateRef.current?.showPicker?.() || hiddenDateRef.current?.click()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                  title="Pick a date"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <input ref={hiddenDateRef} type="date" className="sr-only" onChange={onPickDate} />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Drive Venue:</label>
              <div className="relative">
                <button type="button" className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-full text-left ${driveDraft.driveVenues.length ? 'bg-green-100' : 'bg-gray-100'}`} onClick={() => setShowVenues((v) => !v)}>
                  {driveDraft.driveVenues.length ? driveDraft.driveVenues.join(' | ') : 'Select venues'}
                </button>
                {showVenues && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow">
                    {DRIVE_VENUES.map((v) => (
                      <label key={v} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={driveDraft.driveVenues.includes(v)} onChange={() => toggleVenue(v)} />
                        <span>{v}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

              {/* Save/Cancel removed; values are saved live */}
            </>
          ) : !canShowSection('drive') ? (
            <p className="text-sm text-slate-500 italic">Complete Company Details section to continue</p>
          ) : null}
          
          {isDriveDetailsComplete && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toggleSection('drive')}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded-md"
                title={isSectionCollapsed('drive') ? 'Expand section' : 'Minimize section'}
              >
                {isSectionCollapsed('drive') ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Skills & Eligibility */}
        <section className="space-y-4 border-b-[1.5px] border-gray-600 pb-6 mb-6">
          <h3 className="text-lg font-semibold">Skills & Eligibility</h3>
          
          {canShowSection('skills') && !isSectionCollapsed('skills') ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Qualification:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.qualification?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. B.Tech, BCA, MCA" value={form.qualification} onChange={(e) => update({ qualification: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Specialization:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.specialization?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. Computer Science (optional)" value={form.specialization} onChange={(e) => update({ specialization: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Year of Passing:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.yop?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. 2025" value={form.yop} onChange={(e) => update({ yop: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-black font-medium">Minimum CGPA/Percentage:</label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.minCgpa?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. 7.0 CGPA or 70%" value={form.minCgpa} onChange={(e) => update({ minCgpa: e.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-black font-medium">Skills:</label>
            <div className={`relative border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[42px] flex flex-wrap items-center gap-1 ${form.skills.length > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
              {form.skills.map((s, idx) => (
                <span key={`${s}-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {s}
                  <button type="button" className="ml-1 hover:text-blue-900" onClick={() => removeSkill(idx)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                placeholder={form.skills.length === 0 ? "e.g. JavaScript, React, Node.js (comma separated)" : ""}
                value={form.skillsInput}
                onChange={(e) => update({ skillsInput: e.target.value })}
                onKeyDown={onSkillsKeyDown}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Year Gaps:</label>
              <div className="relative">
                {!gapInputMode ? (
                  <>
                    <select 
                      className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-full appearance-none cursor-pointer pr-8 ${form.gapAllowed !== 'Not Allowed' ? 'bg-green-50' : 'bg-gray-50'}`} 
                      value={form.gapAllowed} 
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'Custom') {
                          setGapInputMode(true);
                          setTimeout(() => {
                            const input = document.querySelector('[data-gap-input]');
                            if (input) input.focus();
                          }, 100);
                        } else {
                          update({ gapAllowed: value, gapYears: '' });
                        }
                      }}
                    >
                      <option value="Allowed">Allowed</option>
                      <option value="Not Allowed">Not Allowed</option>
                      <option value="Custom">{form.gapYears ? `${form.gapYears} Year Allowed` : '_  Year Allowed'}</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-800" />
                    </div>
                  </>
                ) : (
                  <div className="border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm w-full flex items-center">
                    <input 
                      data-gap-input
                      type="text" 
                      className="bg-transparent border-none outline-none text-sm w-8 text-center" 
                      placeholder="_"
                      value={form.gapYears}
                      onChange={(e) => update({ gapYears: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && form.gapYears.trim()) {
                          update({ gapAllowed: 'Custom' });
                          setGapInputMode(false);
                        } else if (e.key === 'Escape') {
                          update({ gapAllowed: 'Not Allowed', gapYears: '' });
                          setGapInputMode(false);
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          update({ gapAllowed: 'Not Allowed', gapYears: '' });
                          setGapInputMode(false);
                        }
                      }}
                    />
                    <span className="text-sm ml-1">Year Allowed</span>
                    <button 
                      type="button"
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        if (form.gapYears.trim()) {
                          update({ gapAllowed: 'Custom' });
                          setGapInputMode(false);
                        }
                      }}
                    >
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Active Backlogs:</label>
              <select className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.backlogs !== 'Not Allowed' ? 'bg-green-50' : 'bg-gray-50'}`} value={form.backlogs} onChange={(e) => update({ backlogs: e.target.value })}>
                <option>Allowed</option>
                <option>Not Allowed</option>
              </select>
            </div>
              </div>
            </>
          ) : !canShowSection('skills') ? (
            <p className="text-sm text-slate-500 italic">Complete About Drive section to continue</p>
          ) : null}
          
          {isSkillsEligibilityComplete && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toggleSection('skills')}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded-md"
                title={isSectionCollapsed('skills') ? 'Expand section' : 'Minimize section'}
              >
                {isSectionCollapsed('skills') ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
              </button>
            </div>
          )}
        </section>

        {/* Section 4: Interview Process */}
        <section className="space-y-4 border-b-[1.5px] border-gray-600 pb-6 mb-6">
          <h3 className="text-lg font-semibold">Interview Process</h3>
          
          {canShowSection('interview') && !isSectionCollapsed('interview') ? (
            <>
              {/* Base fixed rounds */}
          <div className="flex flex-wrap items-center gap-4">
            {[0,1,2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-xs font-medium text-black whitespace-nowrap">{['I Round','II Round','III Round'][i]}</div>
                <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-48 ${form.baseRoundDetails[i]?.trim() ? 'bg-green-100' : 'bg-gray-100'}`} placeholder="e.g. Online test, DS&A" value={form.baseRoundDetails[i]} onChange={(e) => updateBaseRoundDetail(i, e.target.value)} required />
                {i < 2 && <span className="text-slate-300">—</span>}
              </div>
            ))}
          </div>

          {/* Extra rounds */}
          <div className="flex flex-wrap items-center gap-4">
            {form.extraRounds.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="text-xs font-medium text-slate-600 whitespace-nowrap">{r.title}</div>
                <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm w-48 ${r.detail?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. Managerial round (optional)" value={r.detail} onChange={(e) => updateExtraRoundDetail(idx, e.target.value)} />
                <button type="button" onClick={() => removeExtraRound(idx)} className="text-slate-500 hover:text-red-600" title="Remove this round">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addRound} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
              <Plus className="w-4 h-4" /> Add Round
            </button>
          </div>

          {/* Agreement notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                Service Agreement: 
                <div className="relative">
                  <Info 
                    className="w-3 h-3 text-slate-500 hover:text-slate-700 cursor-help" 
                    onMouseEnter={() => setTooltipVisible(prev => ({ ...prev, serviceAgreement: true }))}
                    onMouseLeave={() => setTooltipVisible(prev => ({ ...prev, serviceAgreement: false }))}
                  />
                  {tooltipVisible.serviceAgreement && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                      This defines the minimum tenure with company.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              </label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.serviceAgreement?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. 1 year bond (optional)" value={form.serviceAgreement} onChange={(e) => update({ serviceAgreement: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                Blocking Period: 
                <div className="relative">
                  <Info 
                    className="w-3 h-3 text-slate-500 hover:text-slate-700 cursor-help" 
                    onMouseEnter={() => setTooltipVisible(prev => ({ ...prev, blockingPeriod: true }))}
                    onMouseLeave={() => setTooltipVisible(prev => ({ ...prev, blockingPeriod: false }))}
                  />
                  {tooltipVisible.blockingPeriod && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                      The duration candidate cannot apply elsewhere.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              </label>
              <input className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${form.blockingPeriod?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} placeholder="e.g. 6 months (optional)" value={form.blockingPeriod} onChange={(e) => update({ blockingPeriod: e.target.value })} />
            </div>
          </div>
            </>
          ) : !canShowSection('interview') ? (
            <p className="text-sm text-slate-500 italic">Complete Skills & Eligibility section to continue</p>
          ) : null}
          
          {canShowSection('interview') && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => toggleSection('interview')}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded-md"
                title={isSectionCollapsed('interview') ? 'Expand section' : 'Minimize section'}
              >
                {isSectionCollapsed('interview') ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
              </button>
            </div>
          )}
        </section>

        {/* Final Section: Instructions + Buttons */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Any Specific Instructions:</label>
            <textarea 
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[120px] max-h-[250px] resize-y ${form.instructions?.trim() ? 'bg-green-50' : 'bg-gray-50'}`} 
              placeholder="Any notes for candidates or TPO team (optional)" 
              value={form.instructions} 
              onChange={(e) => update({ instructions: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const textarea = e.target;
                  const cursorPosition = textarea.selectionStart;
                  const textBefore = textarea.value.substring(0, cursorPosition);
                  const textAfter = textarea.value.substring(cursorPosition);
                  
                  // Check if we're at the beginning of a line or after a bullet point
                  const lines = textBefore.split('\n');
                  const currentLine = lines[lines.length - 1];
                  
                  let newText;
                  if (currentLine.trim() === '' || currentLine.trim() === '•') {
                    // If current line is empty or just a bullet, add a new bullet point
                    newText = textBefore + '\n• ' + textAfter;
                  } else if (currentLine.startsWith('• ')) {
                    // If current line already has a bullet, add a new bullet point
                    newText = textBefore + '\n• ' + textAfter;
                  } else {
                    // If current line doesn't have a bullet, convert it to a bullet point and add new one
                    const updatedCurrentLine = '• ' + currentLine;
                    const updatedLines = [...lines.slice(0, -1), updatedCurrentLine];
                    newText = updatedLines.join('\n') + '\n• ' + textAfter;
                  }
                  
                  update({ instructions: newText });
                  
                  // Set cursor position after the new bullet point
                  setTimeout(() => {
                    const newCursorPosition = newText.length - textAfter.length;
                    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
                  }, 0);
                }
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canPost || posting}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white ${!canPost || posting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {posting ? <Loader className="w-4 h-4 animate-spin" /> : null}
              Save & Post
            </button>
            <button
              type="button"
              onClick={() => resetForm()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border border-slate-200 hover:bg-slate-50"
            >
              Cancel / Reset
            </button>
            <button
              type="button"
              onClick={cloneForAnother}
              disabled={!canPost}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${!canPost ? 'bg-emerald-200 text-emerald-500 border-emerald-300 cursor-not-allowed' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'}`}
            >
              + Add Another Position
            </button>
          </div>
        </section>
      </form>

      {/* Saved positions fieldset */}
      {savedPositions.length > 0 && (
        <fieldset className="mt-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
          <legend className="px-2 text-sm font-semibold text-gray-700">Added Positions ({savedPositions.length})</legend>
          <div className="space-y-3">
            {savedPositions.map((p, i) => (
              <div key={`${p.company}-${p.jobTitle}-${i}`} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-3 bg-white rounded-md border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Company</span>
                  <span className="text-sm text-gray-800 font-medium">{p.company}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Position</span>
                  <span className="text-sm text-gray-800">{p.jobTitle}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Job Type</span>
                  <span className="text-sm text-gray-800">{p.jobType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">Work Mode</span>
                  <span className="text-sm text-gray-800">{p.workMode}</span>
                </div>
                <div className="flex justify-end items-center">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedPositions.has(i)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedPositions);
                        if (e.target.checked) {
                          newSelected.add(i);
                        } else {
                          newSelected.delete(i);
                        }
                        setSelectedPositions(newSelected);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        // Load complete position data back into form for editing
                        update({
                          company: p.company,
                          jobTitle: p.jobTitle,
                          jobType: p.jobType,
                          workMode: p.workMode,
                          // Reset other fields to ensure clean editing
                          stipend: '',
                          duration: '',
                          salary: '',
                          responsibilities: '',
                          driveDateText: '',
                          driveDateISO: '',
                          driveVenues: [],
                          qualification: '',
                          specialization: '',
                          yop: '',
                          minCgpa: '',
                          skills: [],
                          skillsInput: '',
                          gapAllowed: 'Not Allowed',
                          gapYears: '',
                          backlogs: 'Not Allowed',
                          serviceAgreement: '',
                          blockingPeriod: '',
                          baseRoundDetails: ['', '', ''],
                          extraRounds: [],
                          instructions: ''
                        });
                        // Clear drive draft
                        setDriveDraft({
                          driveDateText: '',
                          driveDateISO: '',
                          driveVenues: []
                        });
                        // Reset gap input mode
                        setGapInputMode(false);
                        // Remove from saved positions
                        setSavedPositions(list => list.filter((_, idx) => idx !== i));
                        // Expand all sections for editing
                        setCollapsedSections(new Set());
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit position"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setSavedPositions(list => list.filter((_, idx) => idx !== i));
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete position"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
