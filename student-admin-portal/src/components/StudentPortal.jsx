import React, { useState } from "react";
import { usePortal } from "../context/PortalContext";
import { 
  GraduationCap, 
  CalendarCheck, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  X, 
  FileCheck, 
  Award, 
  BookOpen, 
  Eye, 
  Download, 
  Search, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import "./StudentPortal.css";

export const StudentPortal = () => {
  const { data, currentUser, submitAssignment, showToast } = usePortal();

  // Active tab: "assignments" | "attendance"
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignmentFilter, setAssignmentFilter] = useState("all"); // "all" | "pending" | "submitted"
  const [searchQuery, setSearchQuery] = useState("");

  // Viewing assignment details modal
  const [viewingAssignment, setViewingAssignment] = useState(null);

  // Selected assignment for uploading/submitting
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({
    fileName: "",
    fileSize: "1.2 MB",
    notes: ""
  });

  // Current student record from data.students
  const studentProfile = (data.students || []).find((s) => s.id === currentUser?.studentId) || {
    id: currentUser?.studentId || "STU-BT-AIML-A01",
    name: currentUser?.name || "Aarav Sharma",
    rollNumber: "BT-AIML-2026-A01",
    course: currentUser?.course || "B.Tech",
    branch: currentUser?.branch || "AIML",
    branchName: "Artificial Intelligence & Machine Learning",
    year: currentUser?.year || "3rd Year",
    section: currentUser?.section || "A",
    department: "B.Tech - AIML",
    semester: "Semester 6",
    email: currentUser?.email || "aarav.aiml.a01@portal.edu"
  };

  // Student's personal attendance records
  const studentAttendance = (data.attendance || [])
    .filter((a) => a.studentId === studentProfile.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === "Present").length;
  const absentDays = studentAttendance.filter((a) => a.status === "Absent").length;
  const lateDays = studentAttendance.filter((a) => a.status === "Late").length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  // Student's assignment submissions
  const studentSubmissions = (data.submissions || []).filter(
    (s) => s.studentId === studentProfile.id
  );

  const isAssignmentSubmitted = (assignmentId) => {
    return studentSubmissions.some((s) => s.assignmentId === assignmentId);
  };

  const getSubmissionDetails = (assignmentId) => {
    return studentSubmissions.find((s) => s.assignmentId === assignmentId);
  };

  // Open submission modal
  const handleOpenSubmitModal = (assignment) => {
    const existing = getSubmissionDetails(assignment.id);
    setSelectedAssignmentForSubmit(assignment);
    if (existing) {
      setSubmissionForm({
        fileName: existing.fileName,
        fileSize: existing.fileSize || "1.2 MB",
        notes: existing.notes || ""
      });
    } else {
      setSubmissionForm({
        fileName: `${studentProfile.name.toLowerCase().replace(/\s+/g, "_")}_${assignment.id.toLowerCase()}_solution.pdf`,
        fileSize: "1.2 MB",
        notes: ""
      });
    }
  };

  // Handle submit action
  const handleConfirmSubmission = (e) => {
    e.preventDefault();
    if (!selectedAssignmentForSubmit) return;

    submitAssignment({
      assignmentId: selectedAssignmentForSubmit.id,
      fileName: submissionForm.fileName || "assignment_solution.pdf",
      fileSize: submissionForm.fileSize || "1.4 MB",
      notes: submissionForm.notes
    });

    setSelectedAssignmentForSubmit(null);
    if (viewingAssignment?.id === selectedAssignmentForSubmit.id) {
      setViewingAssignment(null);
    }
  };

  // Simulated download of assignment material
  const handleDownloadSpec = (assignment) => {
    const content = `======================================================
COURSE ASSIGNMENT SPECIFICATION
======================================================
Subject:     ${assignment.subject}
Title:       ${assignment.title}
Assignment ID: ${assignment.id}
Due Date:    ${assignment.dueDate}
Total Marks: ${assignment.points} Points
Created On:  ${assignment.createdDate || "N/A"}
Target Dept: ${assignment.department || "All Departments"}

------------------------------------------------------
DESCRIPTION & INSTRUCTIONS:
------------------------------------------------------
${assignment.description}

------------------------------------------------------
DELIVERABLES:
------------------------------------------------------
Please submit your completed project solution file (.pdf, .zip, .docx)
through the student portal before the due date.

======================================================
Generated from EduPortal Client JSON Storage
======================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = assignment.attachmentName || `${assignment.id}_specification.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Downloaded specification for "${assignment.title}"`, "success");
  };

  // Filter assignments
  const allAssignments = data.assignments || [];

  const filteredAssignments = allAssignments.filter((assignment) => {
    const submitted = isAssignmentSubmitted(assignment.id);
    const matchesFilter =
      assignmentFilter === "all" ||
      (assignmentFilter === "pending" && !submitted) ||
      (assignmentFilter === "submitted" && submitted);

    const matchesSearch =
      searchQuery.trim() === "" ||
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = allAssignments.filter((a) => !isAssignmentSubmitted(a.id)).length;
  const submittedCount = allAssignments.filter((a) => isAssignmentSubmitted(a.id)).length;

  return (
    <div className="student-portal">
      {/* Student Welcome Header Banner */}
      <div className="student-hero-card portal-card">
        <div className="student-hero-content">
          <div className="student-badge-wrap">
            <span className="badge badge-info">
              <GraduationCap size={14} /> Student Portal
            </span>
            <span className="roll-chip">{studentProfile.rollNumber}</span>
          </div>

          <h1 className="student-greeting">Welcome back, {studentProfile.name}!</h1>
          <div className="student-meta-list">
            <span><strong>Course:</strong> <span className="badge badge-primary">{studentProfile.course}</span></span>
            <span className="separator">&bull;</span>
            <span><strong>Branch:</strong> <span className="badge badge-secondary">{studentProfile.branch}</span></span>
            <span className="separator">&bull;</span>
            <span><strong>Year:</strong> <span className="badge badge-info">{studentProfile.year || "3rd Year"}</span></span>
            <span className="separator">&bull;</span>
            <span><strong>Section:</strong> <span className="section-pill">Section {studentProfile.section}</span></span>
            <span className="separator">&bull;</span>
            <span><strong>Term:</strong> {studentProfile.semester}</span>
            <span className="separator">&bull;</span>
            <span><strong>Roll:</strong> <span className="roll-badge">{studentProfile.rollNumber}</span></span>
          </div>
        </div>

        {/* Quick summary cards */}
        <div className="student-stats-row">
          <div className="student-stat-box">
            <span className="stat-box-label">Attendance Rate</span>
            <div className="stat-box-val-row">
              <span className={`stat-box-val ${attendanceRate >= 75 ? "text-success" : "text-warning"}`}>
                {attendanceRate}%
              </span>
              <span className="stat-box-sub">
                {attendanceRate >= 75 ? "Good Standing" : "Attendance Shortage"}
              </span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${attendanceRate >= 75 ? "bg-success" : "bg-warning"}`}
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>

          <div className="student-stat-box">
            <span className="stat-box-label">Assignments Status</span>
            <div className="stat-box-val-row">
              <span className="stat-box-val text-primary">
                {submittedCount} / {allAssignments.length}
              </span>
              <span className="stat-box-sub">Completed</span>
            </div>
            <span className="stat-extra-info">
              {pendingCount} pending submission{pendingCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="student-tabs">
        <button
          className={`student-tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          <BookOpen size={18} />
          <span>1. View Course Assignments & Submit</span>
          <span className="tab-bubble">{allAssignments.length}</span>
        </button>

        <button
          className={`student-tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <CalendarCheck size={18} />
          <span>2. My Attendance Records</span>
          <span className="tab-bubble">{totalDays} days</span>
        </button>
      </div>

      {/* ================= VIEW 1: ASSIGNMENTS & UPLOAD ================= */}
      {activeTab === "assignments" && (
        <section className="portal-card tab-content-card">
          <div className="assignments-toolbar">
            <div>
              <div className="title-with-pill">
                <h2 className="section-title">Assignments Uploaded by Admin</h2>
                <span className="badge badge-primary">{allAssignments.length} Total</span>
              </div>
              <p className="section-desc">
                Click <strong>"View Assignment"</strong> to inspect full instructions and download teacher attachments, or <strong>"Upload Solution"</strong> to submit your work.
              </p>
            </div>

            <div className="filter-toolbar-controls">
              <div className="student-search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input search-input"
                />
              </div>

              <div className="filter-pill-group">
                <button
                  className={`filter-pill ${assignmentFilter === "all" ? "active" : ""}`}
                  onClick={() => setAssignmentFilter("all")}
                >
                  All ({allAssignments.length})
                </button>
                <button
                  className={`filter-pill ${assignmentFilter === "pending" ? "active" : ""}`}
                  onClick={() => setAssignmentFilter("pending")}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  className={`filter-pill ${assignmentFilter === "submitted" ? "active" : ""}`}
                  onClick={() => setAssignmentFilter("submitted")}
                >
                  Submitted ({submittedCount})
                </button>
              </div>
            </div>
          </div>

          <div className="student-assignments-grid">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const submission = getSubmissionDetails(assignment.id);
                const isSubmitted = !!submission;
                const isOverdue = new Date(assignment.dueDate) < new Date();

                return (
                  <div key={assignment.id} className={`student-assignment-card ${isSubmitted ? "card-submitted" : ""}`}>
                    <div className="card-top-row">
                      <span className="badge badge-primary">{assignment.subject}</span>
                      {isSubmitted ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={13} /> Submitted
                        </span>
                      ) : (
                        <span className={`badge ${isOverdue ? "badge-danger" : "badge-warning"}`}>
                          <Clock size={13} /> {isOverdue ? "Overdue" : `Due ${assignment.dueDate}`}
                        </span>
                      )}
                    </div>

                    <h3 className="card-assignment-title">{assignment.title}</h3>
                    <p className="card-assignment-desc">{assignment.description}</p>

                    <div className="card-meta-box">
                      <div className="meta-item">
                        <Award size={15} />
                        <span>Maximum Points: <strong>{assignment.points}</strong></span>
                      </div>
                      <div className="meta-item">
                        <FileText size={15} />
                        <span>Teacher Spec: <strong>{assignment.attachmentName}</strong></span>
                      </div>
                    </div>

                    {/* Submission state display */}
                    {isSubmitted && (
                      <div className="student-submitted-banner">
                        <div className="sub-banner-header">
                          <FileCheck size={16} color="#059669" />
                          <span>Submitted on {submission.submittedAt}</span>
                        </div>
                        <div className="sub-banner-details">
                          <strong>Attached:</strong> {submission.fileName} ({submission.fileSize || "1.2 MB"})
                        </div>
                        {submission.notes && (
                          <div className="sub-banner-notes">
                            <em>"{submission.notes}"</em>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="assignment-dual-actions">
                      <button
                        onClick={() => setViewingAssignment(assignment)}
                        className="btn btn-secondary view-details-btn"
                        title="View assignment details and download spec"
                      >
                        <Eye size={16} />
                        <span>View Assignment</span>
                      </button>

                      <button
                        onClick={() => handleOpenSubmitModal(assignment)}
                        className={`btn ${isSubmitted ? "btn-secondary" : "btn-primary"} submit-cta-btn`}
                      >
                        <UploadCloud size={16} />
                        <span>{isSubmitted ? "Re-submit" : "Upload Solution"}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-assignments-box">
                <FileCheck size={42} className="empty-icon" />
                <h4>No assignments found</h4>
                <p>
                  {searchQuery 
                    ? `No assignments match "${searchQuery}".` 
                    : `No assignments currently in the "${assignmentFilter}" category.`}
                </p>
                {(searchQuery || assignmentFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setAssignmentFilter("all");
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: "0.75rem" }}
                  >
                    Reset Filter to All Assignments
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= VIEW 2: ATTENDANCE RECORDS ================= */}
      {activeTab === "attendance" && (
        <section className="portal-card tab-content-card">
          <div className="attendance-view-header">
            <div>
              <h2 className="section-title">My Attendance Breakdown</h2>
              <p className="section-desc">
                View your complete date-wise attendance records marked by the administrator.
              </p>
            </div>

            <div className="attendance-pill-stats">
              <span className="badge badge-success">Present: {presentDays} days</span>
              <span className="badge badge-danger">Absent: {absentDays} days</span>
              <span className="badge badge-warning">Late: {lateDays} days</span>
              <span className="badge badge-info">Total Sessions: {totalDays}</span>
            </div>
          </div>

          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Attendance Status</th>
                  <th>Session Remarks</th>
                </tr>
              </thead>
              <tbody>
                {studentAttendance.length > 0 ? (
                  studentAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="date-cell">
                          <Calendar size={15} color="#64748b" />
                          <strong>{record.date}</strong>
                        </div>
                      </td>
                      <td>
                        {record.status === "Present" && (
                          <span className="badge badge-success">
                            <CheckCircle2 size={13} /> Present
                          </span>
                        )}
                        {record.status === "Absent" && (
                          <span className="badge badge-danger">
                            <AlertCircle size={13} /> Absent
                          </span>
                        )}
                        {record.status === "Late" && (
                          <span className="badge badge-warning">
                            <Clock size={13} /> Late Arrival
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="remark-text">
                          {record.remark || "Regular class session"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="empty-table-state">
                      No attendance records have been posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= MODAL: VIEW ASSIGNMENT DETAILS ================= */}
      {viewingAssignment && (
        <div className="modal-overlay" onClick={() => setViewingAssignment(null)}>
          <div className="modal-dialog view-assignment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <BookOpen size={20} />
                <span>Assignment Details</span>
              </div>
              <button
                onClick={() => setViewingAssignment(null)}
                className="btn-icon"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="view-modal-hero">
                <div className="view-badge-bar">
                  <span className="badge badge-primary">{viewingAssignment.subject}</span>
                  <span className="badge badge-info">{viewingAssignment.points} Points</span>
                  <span className="badge badge-warning">Due: {viewingAssignment.dueDate}</span>
                  {viewingAssignment.department && (
                    <span className="badge badge-secondary">{viewingAssignment.department}</span>
                  )}
                </div>
                <h2 className="view-asg-title">{viewingAssignment.title}</h2>
                <div className="view-meta-sub">
                  <span>Assignment Code: <strong>{viewingAssignment.id}</strong></span>
                  {viewingAssignment.createdDate && (
                    <>
                      <span className="separator">&bull;</span>
                      <span>Published on: {viewingAssignment.createdDate}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Instructions Section */}
              <div className="view-section">
                <h4 className="view-section-label">Instructor Instructions &amp; Overview</h4>
                <div className="view-desc-box">
                  <p>{viewingAssignment.description}</p>
                </div>
              </div>

              {/* Attached Material from Admin */}
              <div className="view-section">
                <h4 className="view-section-label">Course Material Uploaded by Admin</h4>
                <div className="view-attachment-card">
                  <div className="view-attachment-info">
                    <div className="attachment-icon-pill">
                      <FileText size={22} />
                    </div>
                    <div>
                      <strong className="attachment-filename">{viewingAssignment.attachmentName}</strong>
                      <span className="attachment-subinfo">
                        {viewingAssignment.attachmentSize || "850 KB"} &bull; Specification Document
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadSpec(viewingAssignment)}
                    className="btn btn-secondary btn-sm download-spec-btn"
                  >
                    <Download size={15} />
                    <span>Download Spec</span>
                  </button>
                </div>
              </div>

              {/* Current Student's Submission Status */}
              <div className="view-section">
                <h4 className="view-section-label">My Submission Status</h4>
                {(() => {
                  const submission = getSubmissionDetails(viewingAssignment.id);
                  if (submission) {
                    return (
                      <div className="view-submission-status-card submitted">
                        <div className="status-top">
                          <span className="badge badge-success">
                            <CheckCircle2 size={13} /> Submitted Successfully
                          </span>
                          <span className="status-date">{submission.submittedAt}</span>
                        </div>
                        <div className="status-file">
                          <FileCheck size={18} color="#059669" />
                          <span><strong>File:</strong> {submission.fileName} ({submission.fileSize || "1.2 MB"})</span>
                        </div>
                        {submission.notes && (
                          <div className="status-notes">
                            <strong>My Note:</strong> {submission.notes}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="view-submission-status-card pending">
                      <div className="status-top">
                        <span className="badge badge-warning">
                          <Clock size={13} /> Pending Submission
                        </span>
                        <span className="status-date">Due: {viewingAssignment.dueDate}</span>
                      </div>
                      <p className="pending-msg">
                        You have not submitted a solution for this assignment yet. Make sure to submit before the deadline.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setViewingAssignment(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingAssignment;
                  setViewingAssignment(null);
                  handleOpenSubmitModal(target);
                }}
                className="btn btn-primary"
              >
                <UploadCloud size={17} />
                <span>
                  {isAssignmentSubmitted(viewingAssignment.id) ? "Re-submit Solution" : "Upload Solution Now"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUBMIT ASSIGNMENT ================= */}
      {selectedAssignmentForSubmit && (
        <div className="modal-overlay" onClick={() => setSelectedAssignmentForSubmit(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <UploadCloud size={20} />
                <span>Upload Assignment Solution</span>
              </div>
              <button
                onClick={() => setSelectedAssignmentForSubmit(null)}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmission}>
              <div className="modal-body">
                <div className="submit-assignment-summary">
                  <span className="badge badge-primary">{selectedAssignmentForSubmit.subject}</span>
                  <h4 className="summary-title">{selectedAssignmentForSubmit.title}</h4>
                  <p className="summary-due">
                    Due Date: <strong>{selectedAssignmentForSubmit.dueDate}</strong> &bull; Total Points: <strong>{selectedAssignmentForSubmit.points}</strong>
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sol-file">
                    Upload Solution File (Stored directly in client JSON) *
                  </label>
                  <div className="file-upload-dropzone">
                    <UploadCloud size={28} className="dropzone-icon" />
                    <span className="dropzone-text">Choose file or enter file name</span>
                    
                    <input
                      type="file"
                      id="student-file-picker"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const sizeKb = Math.round(file.size / 1024);
                          const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
                          setSubmissionForm({
                            ...submissionForm,
                            fileName: file.name,
                            fileSize: sizeStr
                          });
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => document.getElementById("student-file-picker").click()}
                      className="btn btn-secondary btn-sm"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <UploadCloud size={15} />
                      <span>Browse From Computer...</span>
                    </button>

                    <input
                      id="sol-file"
                      type="text"
                      required
                      placeholder="e.g. alex_assignment_solution.zip"
                      value={submissionForm.fileName}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, fileName: e.target.value })}
                      className="form-input dropzone-input"
                    />
                    <small className="dropzone-hint">
                      File is recorded in the client JSON database with zero backend!
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="sol-notes">
                    Submission Notes &amp; Comments (Optional)
                  </label>
                  <textarea
                    id="sol-notes"
                    rows={3}
                    placeholder="Provide details for the instructor, e.g. how to run your project or any assumptions made..."
                    value={submissionForm.notes}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForSubmit(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Submit Assignment to JSON</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
