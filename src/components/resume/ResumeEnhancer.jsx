import React, { useState, useEffect } from 'react';
import { analyzeResume, listAnalyses, applySuggestions, resetToOriginal } from '../../services/resumeEnhancer';
import { Zap, FileText, Target, TrendingUp, CheckCircle, XCircle, Loader, RotateCcw, Play } from 'lucide-react';

export default function ResumeEnhancer({ uid, resumeId = 'default' }) {
  const [jobDescription, setJobDescription] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set());

  // Load previous analyses on mount
  useEffect(() => {
    loadAnalyses();
  }, [uid, resumeId]);

  const loadAnalyses = async () => {
    try {
      const analysesData = await listAnalyses(uid, resumeId);
      setAnalyses(analysesData);
      if (analysesData.length > 0 && !currentAnalysis) {
        setCurrentAnalysis(analysesData[0]);
        setJobDescription(analysesData[0].jobDescription || '');
      }
    } catch (err) {
      console.error('Failed to load analyses:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeResume(uid, resumeId, jobDescription);
      setCurrentAnalysis(analysis);
      setSelectedSuggestions(new Set());
      await loadAnalyses(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestions = async () => {
    if (!currentAnalysis || selectedSuggestions.size === 0) return;

    setApplying(true);
    setError(null);

    try {
      await applySuggestions(uid, resumeId, currentAnalysis.id, Array.from(selectedSuggestions));
      // Refresh current analysis to show applied suggestions
      await loadAnalyses();
      const updatedAnalysis = analyses.find(a => a.id === currentAnalysis.id);
      if (updatedAnalysis) {
        setCurrentAnalysis(updatedAnalysis);
      }
      setSelectedSuggestions(new Set());
    } catch (err) {
      setError(err.message || 'Failed to apply suggestions');
    } finally {
      setApplying(false);
    }
  };

  const handleReset = async () => {
    setApplying(true);
    try {
      await resetToOriginal(uid, resumeId);
    } catch (err) {
      setError(err.message || 'Failed to reset resume');
    } finally {
      setApplying(false);
    }
  };

  const toggleSuggestion = (suggestionId) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Resume Enhancer</h3>
        </div>
        {currentAnalysis && (
          <button
            onClick={handleReset}
            disabled={applying}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Original
          </button>
        )}
      </div>

      {/* Job Description Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to analyze your resume against it..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !jobDescription.trim()}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="flex-1 space-y-6 overflow-auto">
          {/* Score Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">ATS Score</h4>
              <span className="text-xs text-gray-500">
                {new Date(currentAnalysis.createdAt?.toDate?.() || currentAnalysis.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(currentAnalysis.score)}`}>
                {currentAnalysis.score}/100
              </div>
              <div>
                <div className="font-medium text-gray-900">{getScoreLabel(currentAnalysis.score)}</div>
                <div className="text-sm text-gray-600">{currentAnalysis.summary}</div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Keywords Analysis
            </h4>
            <div className="space-y-3">
              {currentAnalysis.keywords.matched.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-green-700 mb-2">
                    Matched Keywords ({currentAnalysis.keywords.matched.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentAnalysis.keywords.matched.slice(0, 10).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {currentAnalysis.keywords.missing.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-700 mb-2">
                    Missing Keywords ({currentAnalysis.keywords.missing.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentAnalysis.keywords.missing.slice(0, 10).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-red-100 text-red-800"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {currentAnalysis.suggestions && currentAnalysis.suggestions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Improvement Suggestions
                </h4>
                {selectedSuggestions.size > 0 && (
                  <button
                    onClick={handleApplySuggestions}
                    disabled={applying}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    {applying ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Apply Selected ({selectedSuggestions.size})
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {currentAnalysis.suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`border rounded-lg p-3 transition-colors ${
                      suggestion.applied
                        ? 'border-green-200 bg-green-50'
                        : selectedSuggestions.has(suggestion.id)
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={suggestion.applied || selectedSuggestions.has(suggestion.id)}
                        disabled={suggestion.applied}
                        onChange={() => toggleSuggestion(suggestion.id)}
                        className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{suggestion.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {suggestion.section}
                          </span>
                          {suggestion.applied && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                              Applied
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Analyses */}
          {analyses.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Previous Analyses
              </h4>
              <div className="space-y-2">
                {analyses.slice(1, 4).map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => {
                      setCurrentAnalysis(analysis);
                      setJobDescription(analysis.jobDescription || '');
                      setSelectedSuggestions(new Set());
                    }}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Score: {analysis.score}/100</div>
                        <div className="text-xs text-gray-500">
                          {new Date(analysis.createdAt?.toDate?.() || analysis.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${getScoreColor(analysis.score)}`}>
                        {getScoreLabel(analysis.score)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!currentAnalysis && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Enhance Your Resume</h3>
            <p className="text-gray-500 mb-4">
              Paste a job description above and click "Analyze Resume" to get personalized suggestions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
