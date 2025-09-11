import React, { useState } from 'react';
import { ImEye } from 'react-icons/im';
import { MdEditNote } from 'react-icons/md';
import { GoBlocked } from 'react-icons/go';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const dummyStudents = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  email: `student${i + 1}@example.com`,
  cgpa: (Math.random() * 4 + 6).toFixed(2),
  center: ['Lucknow', 'Pune', 'Bangalore', 'Delhi'][i % 4],
  school: ['SOT', 'SOH', 'SOM'][i % 3],
  status: ['Active', 'Inactive', 'Blocked'][i % 3],
}));

const BlockStudentModal = ({ isOpen, onClose, student, onConfirm }) => {
  const [blockType, setBlockType] = useState('Permanent');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [otherReason, setOtherReason] = useState('');

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
          <p className="text-sm sm:text-base font-medium text-gray-700">Name: {student.name}</p>
          <p className="text-sm sm:text-base font-medium text-gray-700">ID: {student.id}</p>
          <p className="text-sm sm:text-base font-medium text-gray-700">Program: {student.school}</p>
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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentsPerPage = 5;

  const filteredStudents = dummyStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
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

  const handleBlockConfirm = ({ reason, notes, blockPeriod }) => {
    console.log('Student blocked:', {
      student: selectedStudent,
      reason,
      notes,
      blockPeriod,
    });
    // Add logic to handle the block action, e.g., API call
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student Directory</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email"
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
                  <option value="Lucknow">Lucknow</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
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
                  <option value="SOT">SOT</option>
                  <option value="SOH">SOH</option>
                  <option value="SOM">SOM</option>
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
                    <td className="p-4 text-gray-800 font-medium">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.email}</td>
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
                          <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                            <ImEye className="text-lg" />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            View Details
                          </span>
                        </div>
                        <div className="relative group">
                          <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                            <MdEditNote className="text-xl" />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Edit Student
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={() => handleBlockClick(student)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <GoBlocked className="text-xl" />
                          </button>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {student.status === 'Blocked' ? 'Unblock' : 'Block'} Student
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
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

      <BlockStudentModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        student={selectedStudent}
        onConfirm={handleBlockConfirm}
      />
    </div>
  );
}