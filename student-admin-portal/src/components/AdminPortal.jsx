import React, { useState, useMemo } from "react";
import { usePortal } from "../context/PortalContext";
import { 
  Users, 
  CalendarCheck, 
  FileUp, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Download, 
  Eye, 
  X,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar
} from "lucide-react";
import "./AdminPortal.css";

export const COURSE_STRUCTURE = {
  "B.Tech": {
    name: "Bachelor of Technology",
    maxYears: 4,
    branches: [
      { code: "CSE", name: "Computer Science & Engineering" },
      { code: "AIML", name: "Artificial Intelligence & Machine Learning" },
      { code: "DS", name: "Data Science" },
      { code: "IT", name: "Information Technology" }
    ]
  },
  "MCA": {
    name: "Master of Computer Applications",
    maxYears: 2,
    branches: [
      { code: "CS", name: "Computer Science" },
      { code: "DS", name: "Data Science & Analytics" }
    ]
  },
  "BCA": {
    name: "Bachelor of Computer Applications",
    maxYears: 3,
    branches: [
      { code: "CS", name: "Computer Science" },
      { code: "IT", name: "Information Technology" }
    ]
  }
};

const SECTIONS = ["A", "B", "C", "D"];
const YEARS_LIST = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const PAGE_SIZE = 50;

export const AdminPortal = () => {
  const { 
    data, 
    addStudent, 
    deleteStudent, 
    saveAttendanceBatch, 
    addAssignment, 
    deleteAssignment 
  } = usePortal();

  // Active sub-view tab: "students" | "attendance" | "assignments"
  const [activeTab, setActiveTab] = useState("students");

  // --- Student Management Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterSection, setFilterSection] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Add Student modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    course: "B.Tech",
    branch: "AIML",
    year: "1st Year",
    section: "A",
    semester: "Semester 2",
    phone: ""
  });

  // --- Attendance State & Filters ---
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [attCourse, setAttCourse] = useState("B.Tech");
  const [attBranch, setAttBranch] = useState("AIML");
  const [attYear, setAttYear] = useState("All");
  const [attSection, setAttSection] = useState("A");
  const [attendanceState, setAttendanceState] = useState({});

  // Reset branch filter when course filter changes
  const handleCourseFilterChange = (course) => {
    setFilterCourse(course);
    setFilterBranch("All");
    setCurrentPage(1);
  };

  // Available branches based on selected course for filtering
  const availableBranchesForFilter = useMemo(() => {
    if (filterCourse === "All") {
      return ["CSE", "AIML", "DS", "IT", "CS"];
    }
    return (COURSE_STRUCTURE[filterCourse]?.branches || []).map((b) => b.code);
  }, [filterCourse]);

  // Available branches for Attendance section picker
  const availableBranchesForAtt = useMemo(() => {
    return (COURSE_STRUCTURE[attCourse]?.branches || []).map((b) => b.code);
  }, [attCourse]);

  // Keep attendance branch valid
  React.useEffect(() => {
    if (!availableBranchesForAtt.includes(attBranch)) {
      setAttBranch(availableBranchesForAtt[0] || "AIML");
    }
  }, [attCourse, availableBranchesForAtt, attBranch]);

  // Keep add student form branch valid
  const availableBranchesForAddForm = useMemo(() => {
    return (COURSE_STRUCTURE[studentForm.course]?.branches || []).map((b) => b.code);
  }, [studentForm.course]);

  React.useEffect(() => {
    if (!availableBranchesForAddForm.includes(studentForm.branch)) {
      setStudentForm((prev) => ({ ...prev, branch: availableBranchesForAddForm[0] || "CSE" }));
    }
  }, [studentForm.course, availableBranchesForAddForm]);

  // Initialize attendance state for all students on date change
  React.useEffect(() => {
    const existingRecords = (data.attendance || []).filter((a) => a.date === selectedDate);
    const initialMap = {};
    
    (data.students || []).forEach((student) => {
      const found = existingRecords.find((r) => r.studentId === student.id);
      if (found) {
        initialMap[student.id] = { status: found.status, remark: found.remark || "" };
      } else {
        initialMap[student.id] = { status: "Present", remark: "" };
      }
    });

    setAttendanceState(initialMap);
  }, [selectedDate, data.students, data.attendance]);

  // --- Assignment Management State ---
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState(null);
  const [asgCourseFilter, setAsgCourseFilter] = useState("All");

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "AI401: Deep Neural Networks",
    course: "B.Tech",
    branch: "AIML",
    year: "All Years",
    section: "All Sections",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    points: 100,
    description: "",
    attachmentName: "deep_learning_spec.pdf",
    attachmentSize: "1.4 MB"
  });

  // --- Handlers: Students ---
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) return;

    addStudent(studentForm);
    setStudentForm({
      name: "",
      rollNumber: "",
      email: "",
      course: "B.Tech",
      branch: "AIML",
      year: "1st Year",
      section: "A",
      semester: "Semester 2",
      phone: ""
    });
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${student.name}" (${student.rollNumber})?\n\nCourse: ${student.course} | Branch: ${student.branch} | Year: ${student.year} | Section: ${student.section}\nThis will remove their profile, attendance, and assignment submissions from the JSON store.`
    );
    if (confirmed) {
      deleteStudent(student.id);
    }
  };

  // --- Handlers: Attendance ---
  const handleStatusChange = (studentId, status) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remark
      }
    }));
  };

  const markAllSectionStatus = (status) => {
    const updated = { ...attendanceState };
    visibleSectionStudents.forEach((s) => {
      updated[s.id] = {
        status,
        remark: attendanceState[s.id]?.remark || ""
      };
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = () => {
    saveAttendanceBatch(selectedDate, attendanceState);
  };

  // --- Handlers: Assignments ---
  const handleAddAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!assignmentForm.title || !assignmentForm.subject || !assignmentForm.dueDate) return;

    addAssignment(assignmentForm);
    setAssignmentForm({
      title: "",
      subject: "AI401: Deep Neural Networks",
      course: "B.Tech",
      branch: "AIML",
      year: "All Years",
      section: "All Sections",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      points: 100,
      description: "",
      attachmentName: "deep_learning_spec.pdf",
      attachmentSize: "1.4 MB"
    });
    setShowAddAssignmentModal(false);
  };

  const handleDeleteAssignment = (assignment) => {
    const confirmed = window.confirm(
      `Delete assignment "${assignment.title}"?\nAll associated student submissions will also be removed from the JSON store.`
    );
    if (confirmed) {
      deleteAssignment(assignment.id);
    }
  };

  // Filtered Students list across 1,600 students
  const filteredStudents = useMemo(() => {
    return (data.students || []).filter((student) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = filterCourse === "All" || student.course === filterCourse;
      const matchesBranch = filterBranch === "All" || student.branch === filterBranch;
      const matchesYear = filterYear === "All" || student.year === filterYear;
      const matchesSection = filterSection === "All" || student.section === filterSection;

      return matchesSearch && matchesCourse && matchesBranch && matchesYear && matchesSection;
    });
  }, [data.students, searchTerm, filterCourse, filterBranch, filterYear, filterSection]);

  // Paginated Students (50 per page)
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  // Students in currently selected class/section for attendance
  const visibleSectionStudents = useMemo(() => {
    return (data.students || []).filter((student) => {
      const matchCourse = student.course === attCourse;
      const matchBranch = student.branch === attBranch;
      const matchSection = student.section === attSection;
      const matchYear = attYear === "All" || student.year === attYear;
      return matchCourse && matchBranch && matchSection && matchYear;
    });
  }, [data.students, attCourse, attBranch, attSection, attYear]);

  // Daily attendance statistics for visible section
  const currentSectionStats = useMemo(() => {
    const ids = visibleSectionStudents.map((s) => s.id);
    const relevantValues = ids.map((id) => attendanceState[id] || { status: "Present" });
    const total = relevantValues.length;
    if (total === 0) return { present: 0, absent: 0, late: 0, rate: 0 };
    const present = relevantValues.filter((v) => v.status === "Present").length;
    const absent = relevantValues.filter((v) => v.status === "Absent").length;
    const late = relevantValues.filter((v) => v.status === "Late").length;
    const rate = Math.round((present / total) * 100);
    return { present, absent, late, rate };
  }, [attendanceState, visibleSectionStudents]);

  // Filtered Assignments
  const filteredAssignments = (data.assignments || []).filter((asg) => {
    if (asgCourseFilter === "All") return true;
    return asg.course === asgCourseFilter || asg.course === "All Courses";
  });

  // Calculate Student Attendance percentage helper
  const getStudentAttendanceStats = (studentId) => {
    const records = (data.attendance || []).filter((a) => a.studentId === studentId);
    if (records.length === 0) return { percent: 100, present: 0, total: 0 };
    const presentCount = records.filter((r) => r.status === "Present").length;
    const percent = Math.round((presentCount / records.length) * 100);
    return { percent, present: presentCount, total: records.length };
  };

  // Course counts
  const btechTotal = (data.students || []).filter((s) => s.course === "B.Tech").length;
  const mcaTotal = (data.students || []).filter((s) => s.course === "MCA").length;
  const bcaTotal = (data.students || []).filter((s) => s.course === "BCA").length;

  return (
    <div className="admin-portal">
      {/* Top Welcome & KPI Header */}
      <div className="admin-header-card portal-card">
        <div className="admin-header-main">
          <div>
            <div className="header-badge-row">
              <span className="badge badge-primary">Admin Control Center</span>
              <span className="badge badge-info">1,600 Indian Students &bull; 1st to 4th Year</span>
              <span className="badge badge-secondary">B.Tech (CSE, AIML, Data Science, IT)</span>
            </div>
            <h1 className="admin-title">Academic Administration Dashboard</h1>
            <p className="admin-subtitle">
              Manage students across <strong>B.Tech</strong> (CSE, AI &amp; ML, Data Science, IT), <strong>MCA</strong> (CS, DS), and <strong>BCA</strong> (CS, IT). 
              Every branch has four sections (A, B, C, D) with 50 students in each section across 1st to 4th Years.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="btn btn-primary"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="btn btn-secondary"
            >
              <FileUp size={18} />
              <span>Upload Assignment</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap primary">
              <Users size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Student Body</span>
              <span className="stat-value">{data.students.length}</span>
              <span className="stat-subdetail">
                {btechTotal} B.Tech &bull; {mcaTotal} MCA &bull; {bcaTotal} BCA
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap success">
              <CalendarCheck size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Class Attendance</span>
              <span className="stat-value">{currentSectionStats.rate}%</span>
              <span className="stat-subdetail">
                {attCourse} {attBranch} ({currentSectionStats.present}/{visibleSectionStudents.length} Present)
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap warning">
              <BookOpen size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Course Assignments</span>
              <span className="stat-value">{data.assignments.length}</span>
              <span className="stat-subdetail">Targeted by Year &amp; Branch</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap info">
              <FileText size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Submissions Received</span>
              <span className="stat-value">{data.submissions.length}</span>
              <span className="stat-subdetail">Logged to Client JSON store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <Users size={18} />
          <span>1. Student Directory ({data.students.length})</span>
          <span className="tab-pill">B.Tech &bull; MCA &bull; BCA</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <CalendarCheck size={18} />
          <span>2. Daily Attendance by Year &amp; Section</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          <FileUp size={18} />
          <span>3. Coursework &amp; Submissions</span>
          <span className="tab-pill">{data.assignments.length}</span>
        </button>
      </div>

      {/* ================= TAB 1: STUDENTS MANAGEMENT ================= */}
      {activeTab === "students" && (
        <section className="portal-card tab-content-card">
          <div className="section-toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <Search size={17} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Indian students by name, roll no, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-input search-input"
                />
              </div>

              {/* Course Filter */}
              <div className="filter-dropdown-wrap">
                <GraduationCap size={15} className="filter-icon" />
                <select
                  value={filterCourse}
                  onChange={(e) => handleCourseFilterChange(e.target.value)}
                  className="form-select filter-select"
                >
                  <option value="All">All Courses ({data.students.length})</option>
                  <option value="B.Tech">B.Tech (800)</option>
                  <option value="MCA">MCA (400)</option>
                  <option value="BCA">BCA (400)</option>
                </select>
              </div>

              {/* Branch Filter */}
              <div className="filter-dropdown-wrap">
                <Layers size={15} className="filter-icon" />
                <select
                  value={filterBranch}
                  onChange={(e) => {
                    setFilterBranch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-select filter-select"
                >
                  <option value="All">All Branches</option>
                  {availableBranchesForFilter.map((code) => (
                    <option key={code} value={code}>
                      Branch: {code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-dropdown-wrap">
                <Calendar size={15} className="filter-icon" />
                <select
                  value={filterYear}
                  onChange={(e) => {
                    setFilterYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-select filter-select"
                >
                  <option value="All">All Years</option>
                  {YEARS_LIST.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="filter-dropdown-wrap">
                <Filter size={15} className="filter-icon" />
                <select
                  value={filterSection}
                  onChange={(e) => {
                    setFilterSection(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-select filter-select"
                >
                  <option value="All">All Sections (A, B, C, D)</option>
                  <option value="A">Section A (50)</option>
                  <option value="B">Section B (50)</option>
                  <option value="C">Section C (50)</option>
                  <option value="D">Section D (50)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              <span>Add Student</span>
            </button>
          </div>

          <div className="results-count-bar">
            <span>
              Showing <strong>{paginatedStudents.length}</strong> of <strong>{filteredStudents.length}</strong> matching students (Page {currentPage} of {totalPages})
            </span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {(filterCourse !== "All" || filterBranch !== "All" || filterYear !== "All" || filterSection !== "All" || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterCourse("All");
                    setFilterBranch("All");
                    setFilterYear("All");
                    setFilterSection("All");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Course &amp; Branch</th>
                  <th>Academic Year</th>
                  <th>Section</th>
                  <th>Semester</th>
                  <th>Contact Info</th>
                  <th>Attendance %</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => {
                    const stats = getStudentAttendanceStats(student.id);
                    return (
                      <tr key={student.id}>
                        <td>
                          <span className="roll-badge">{student.rollNumber}</span>
                        </td>
                        <td>
                          <div className="student-profile-cell">
                            <div className="avatar-chip">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <strong className="student-name-text">{student.name}</strong>
                              <span className="student-id-sub">{student.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                            <span className={`badge ${student.course === "B.Tech" ? "badge-primary" : student.course === "MCA" ? "badge-info" : "badge-warning"}`}>
                              {student.course}
                            </span>
                            <span className="badge badge-secondary">{student.branch}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">{student.year || "1st Year"}</span>
                        </td>
                        <td>
                          <span className="section-pill">Sec {student.section}</span>
                        </td>
                        <td>
                          <span className="semester-tag">{student.semester}</span>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <span>{student.email}</span>
                            <small className="phone-sub">{student.phone}</small>
                          </div>
                        </td>
                        <td>
                          <div className="attendance-indicator">
                            <span className={`badge ${stats.percent >= 75 ? "badge-success" : stats.percent >= 60 ? "badge-warning" : "badge-danger"}`}>
                              {stats.percent}%
                            </span>
                            <span className="att-sub-count">({stats.present}/{stats.total} days)</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="btn btn-danger btn-sm delete-btn"
                            title="Delete Student and clear records"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="empty-table-state">
                      No students found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={16} />
                <span>Previous 50</span>
              </button>

              <span className="page-indicator">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="btn btn-secondary btn-sm"
              >
                <span>Next 50</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ================= TAB 2: ATTENDANCE MANAGEMENT ================= */}
      {activeTab === "attendance" && (
        <section className="portal-card tab-content-card">
          <div className="attendance-header-bar">
            <div className="att-filter-group">
              <div className="date-picker-wrap">
                <label className="form-label" htmlFor="att-date-picker">Date:</label>
                <input
                  id="att-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input date-input"
                />
              </div>

              {/* Attendance Course */}
              <div className="filter-dropdown-wrap">
                <label className="form-label">Course:</label>
                <select
                  value={attCourse}
                  onChange={(e) => setAttCourse(e.target.value)}
                  className="form-select filter-select"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="BCA">BCA</option>
                </select>
              </div>

              {/* Attendance Branch */}
              <div className="filter-dropdown-wrap">
                <label className="form-label">Branch:</label>
                <select
                  value={attBranch}
                  onChange={(e) => setAttBranch(e.target.value)}
                  className="form-select filter-select"
                >
                  {availableBranchesForAtt.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attendance Year */}
              <div className="filter-dropdown-wrap">
                <label className="form-label">Year:</label>
                <select
                  value={attYear}
                  onChange={(e) => setAttYear(e.target.value)}
                  className="form-select filter-select"
                >
                  <option value="All">All Years</option>
                  {YEARS_LIST.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attendance Section */}
              <div className="filter-dropdown-wrap">
                <label className="form-label">Section:</label>
                <select
                  value={attSection}
                  onChange={(e) => setAttSection(e.target.value)}
                  className="form-select filter-select"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            <div className="attendance-summary-pills">
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Present: {currentSectionStats.present}
              </span>
              <span className="badge badge-danger">
                <XCircle size={13} /> Absent: {currentSectionStats.absent}
              </span>
              <span className="badge badge-warning">
                <Clock size={13} /> Late: {currentSectionStats.late}
              </span>
            </div>

            <div className="attendance-bulk-actions">
              <button
                onClick={() => markAllSectionStatus("Present")}
                className="btn btn-secondary btn-sm"
                title="Mark all students of this class Present"
              >
                Mark Section Present
              </button>
              <button
                onClick={() => markAllSectionStatus("Absent")}
                className="btn btn-secondary btn-sm"
              >
                Mark Section Absent
              </button>
              <button
                onClick={handleSaveAttendance}
                className="btn btn-primary btn-sm save-att-btn"
              >
                <CalendarCheck size={16} />
                <span>Save to JSON</span>
              </button>
            </div>
          </div>

          <div className="section-info-callout">
            <span>
              Managing attendance for <strong>{attCourse} - {attBranch} ({attYear === "All" ? "All Years" : attYear}) Section {attSection}</strong> ({visibleSectionStudents.length} Students) on <strong>{selectedDate}</strong>
            </span>
          </div>

          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Branch &amp; Year</th>
                  <th>Status (Click to toggle)</th>
                  <th>Teacher Remark / Note</th>
                </tr>
              </thead>
              <tbody>
                {visibleSectionStudents.length > 0 ? (
                  visibleSectionStudents.map((student) => {
                    const currentStatus = attendanceState[student.id]?.status || "Present";
                    const currentRemark = attendanceState[student.id]?.remark || "";

                    return (
                      <tr key={student.id}>
                        <td>
                          <span className="roll-badge">{student.rollNumber}</span>
                        </td>
                        <td>
                          <strong>{student.name}</strong>
                        </td>
                        <td>
                          <span className="badge badge-primary">{student.branch}</span>
                          <span className="badge badge-info" style={{ marginLeft: "0.35rem" }}>{student.year}</span>
                        </td>
                        <td>
                          <div className="status-toggle-group">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, "Present")}
                              className={`status-pill present ${currentStatus === "Present" ? "active" : ""}`}
                            >
                              <CheckCircle2 size={14} />
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, "Absent")}
                              className={`status-pill absent ${currentStatus === "Absent" ? "active" : ""}`}
                            >
                              <XCircle size={14} />
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, "Late")}
                              className={`status-pill late ${currentStatus === "Late" ? "active" : ""}`}
                            >
                              <Clock size={14} />
                              Late
                            </button>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. on time, medical excuse..."
                            value={currentRemark}
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            className="form-input remark-input"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-table-state">
                      No students found matching {attCourse} {attBranch} Section {attSection}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="attendance-footer-action">
            <p className="footer-hint">
              Attendance records for this class are synchronized with the browser's JSON storage.
            </p>
            <button
              onClick={handleSaveAttendance}
              className="btn btn-primary"
            >
              <CalendarCheck size={18} />
              <span>Save Section Attendance</span>
            </button>
          </div>
        </section>
      )}

      {/* ================= TAB 3: ASSIGNMENT UPLOAD & SUBMISSIONS ================= */}
      {activeTab === "assignments" && (
        <section className="portal-card tab-content-card">
          <div className="assignment-section-header">
            <div>
              <h2 className="section-title">Course Assignments</h2>
              <p className="section-desc">
                Upload course assignments targeted by Course, Branch, Year, and Section.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <select
                value={asgCourseFilter}
                onChange={(e) => setAsgCourseFilter(e.target.value)}
                className="form-select filter-select"
              >
                <option value="All">All Courses</option>
                <option value="B.Tech">B.Tech Assignments</option>
                <option value="MCA">MCA Assignments</option>
                <option value="BCA">BCA Assignments</option>
              </select>

              <button
                onClick={() => setShowAddAssignmentModal(true)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                <span>Upload New Assignment</span>
              </button>
            </div>
          </div>

          <div className="assignments-list">
            {filteredAssignments.map((assignment) => {
              const assignmentSubmissions = (data.submissions || []).filter(
                (s) => s.assignmentId === assignment.id
              );
              const isOverdue = new Date(assignment.dueDate) < new Date();

              return (
                <div key={assignment.id} className="assignment-item-card">
                  <div className="assignment-item-main">
                    <div className="assignment-badge-row">
                      <span className="badge badge-primary">{assignment.subject}</span>
                      <span className="badge badge-info">{assignment.course || "All Courses"}</span>
                      {assignment.branch && assignment.branch !== "All Branches" && (
                        <span className="badge badge-secondary">{assignment.branch}</span>
                      )}
                      {assignment.year && assignment.year !== "All Years" && (
                        <span className="badge badge-info">{assignment.year}</span>
                      )}
                      {assignment.section && assignment.section !== "All Sections" && (
                        <span className="badge badge-secondary">Sec {assignment.section}</span>
                      )}
                      <span className="badge badge-info">{assignment.points} Points</span>
                      <span className={`badge ${isOverdue ? "badge-danger" : "badge-warning"}`}>
                        Due: {assignment.dueDate}
                      </span>
                    </div>

                    <h3 className="assignment-title">{assignment.title}</h3>
                    <p className="assignment-desc">{assignment.description}</p>

                    <div className="assignment-meta-row">
                      <span className="meta-attachment">
                        <FileText size={15} />
                        Attachment: <strong>{assignment.attachmentName}</strong> ({assignment.attachmentSize || "900 KB"})
                      </span>
                      <span className="meta-submissions">
                        <strong>{assignmentSubmissions.length}</strong> student submissions
                      </span>
                    </div>
                  </div>

                  <div className="assignment-item-actions">
                    <button
                      onClick={() => setSelectedAssignmentForReview(assignment)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Eye size={16} />
                      <span>View Submissions ({assignmentSubmissions.length})</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAssignment(assignment)}
                      className="btn btn-danger btn-sm"
                      title="Delete assignment"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= MODAL: ADD STUDENT ================= */}
      {showAddStudentModal && (
        <div className="modal-overlay" onClick={() => setShowAddStudentModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Users size={20} />
                <span>Enroll New Indian Student</span>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="stu-name">Full Student Name (Indian) *</label>
                  <input
                    id="stu-name"
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma or Ananya Verma"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-course">Course / Degree *</label>
                    <select
                      id="stu-course"
                      value={studentForm.course}
                      onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                      className="form-select"
                    >
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="MCA">MCA (Master of Computer Applications)</option>
                      <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-branch">Affiliated Branch *</label>
                    <select
                      id="stu-branch"
                      value={studentForm.branch}
                      onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="form-select"
                    >
                      {availableBranchesForAddForm.map((code) => (
                        <option key={code} value={code}>
                          {code} - {COURSE_STRUCTURE[studentForm.course]?.branches?.find(b => b.code === code)?.name || code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-year">Academic Year *</label>
                    <select
                      id="stu-year"
                      value={studentForm.year}
                      onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                      className="form-select"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-section">Section (50 Students/Section) *</label>
                    <select
                      id="stu-section"
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                      className="form-select"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-email">Email Address *</label>
                    <input
                      id="stu-email"
                      type="email"
                      required
                      placeholder="student@portal.edu"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="stu-phone">Phone Number</label>
                    <input
                      id="stu-phone"
                      type="tel"
                      placeholder="+91 98765-43210"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-notice-box">
                  <Sparkles size={16} />
                  <span>
                    Enrolling to <strong>{studentForm.course} [{studentForm.branch}] {studentForm.year} Sec {studentForm.section}</strong>. Student login is auto-created with password <code>student123</code>.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD ASSIGNMENT ================= */}
      {showAddAssignmentModal && (
        <div className="modal-overlay" onClick={() => setShowAddAssignmentModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FileUp size={20} />
                <span>Upload New Course Assignment</span>
              </div>
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAssignmentSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="asg-title">Assignment Title *</label>
                  <input
                    id="asg-title"
                    type="text"
                    required
                    placeholder="e.g. Deep Learning Transformer Implementation"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-subj">Subject / Course Name *</label>
                    <input
                      id="asg-subj"
                      type="text"
                      required
                      placeholder="e.g. AI401: Deep Neural Networks"
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-course">Target Course *</label>
                    <select
                      id="asg-course"
                      value={assignmentForm.course}
                      onChange={(e) => {
                        const newCourse = e.target.value;
                        setAssignmentForm({
                          ...assignmentForm,
                          course: newCourse,
                          branch: newCourse === "All Courses" ? "All Branches" : (COURSE_STRUCTURE[newCourse]?.branches[0]?.code || "All Branches")
                        });
                      }}
                      className="form-select"
                    >
                      <option value="All Courses">All Courses (B.Tech, MCA, BCA)</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="MCA">MCA</option>
                      <option value="BCA">BCA</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-branch">Target Branch *</label>
                    <select
                      id="asg-branch"
                      value={assignmentForm.branch}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, branch: e.target.value })}
                      className="form-select"
                    >
                      <option value="All Branches">All Branches</option>
                      {assignmentForm.course !== "All Courses" &&
                        (COURSE_STRUCTURE[assignmentForm.course]?.branches || []).map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.code} - {b.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-year">Target Year</label>
                    <select
                      id="asg-year"
                      value={assignmentForm.year}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, year: e.target.value })}
                      className="form-select"
                    >
                      <option value="All Years">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-section">Target Section</label>
                    <select
                      id="asg-section"
                      value={assignmentForm.section}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, section: e.target.value })}
                      className="form-select"
                    >
                      <option value="All Sections">All Sections (A, B, C, D)</option>
                      <option value="A">Section A Only</option>
                      <option value="B">Section B Only</option>
                      <option value="C">Section C Only</option>
                      <option value="D">Section D Only</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-due">Due Date *</label>
                    <input
                      id="asg-due"
                      type="date"
                      required
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="asg-pts">Total Points / Marks</label>
                    <input
                      id="asg-pts"
                      type="number"
                      min="10"
                      max="500"
                      value={assignmentForm.points}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, points: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attachment Specification File</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="file"
                        id="admin-file-picker"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const sizeKb = Math.round(file.size / 1024);
                            const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
                            setAssignmentForm({
                              ...assignmentForm,
                              attachmentName: file.name,
                              attachmentSize: sizeStr
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("admin-file-picker").click()}
                        className="btn btn-secondary btn-sm"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <FileUp size={15} />
                        <span>Browse...</span>
                      </button>
                      <input
                        id="asg-file"
                        type="text"
                        placeholder="e.g. deep_learning_spec.pdf"
                        value={assignmentForm.attachmentName}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, attachmentName: e.target.value })}
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="asg-desc">Instructions &amp; Description</label>
                  <textarea
                    id="asg-desc"
                    rows={4}
                    placeholder="Provide details on deliverables, requirements, and grading rubric..."
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload &amp; Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW SUBMISSIONS ================= */}
      {selectedAssignmentForReview && (
        <div className="modal-overlay" onClick={() => setSelectedAssignmentForReview(null)}>
          <div className="modal-dialog submissions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <FileText size={20} />
                <span>Student Submissions: {selectedAssignmentForReview.title}</span>
              </div>
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="btn-icon"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {(() => {
                const submissions = (data.submissions || []).filter(
                  (s) => s.assignmentId === selectedAssignmentForReview.id
                );

                if (submissions.length === 0) {
                  return (
                    <div className="empty-submissions">
                      <FileText size={36} className="empty-icon" />
                      <h4>No submissions received yet</h4>
                      <p>Students have not uploaded their solutions for this assignment yet.</p>
                    </div>
                  );
                }

                return (
                  <div className="submissions-list">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="submission-item">
                        <div className="sub-header">
                          <div>
                            <strong className="sub-student-name">{sub.studentName}</strong>
                            <span className="sub-student-id">({sub.studentId})</span>
                          </div>
                          <span className="badge badge-success">{sub.status}</span>
                        </div>

                        <div className="sub-file-card">
                          <FileText size={18} color="#4f46e5" />
                          <div className="sub-file-info">
                            <span className="file-name">{sub.fileName}</span>
                            <span className="file-size">{sub.fileSize || "File attachment"} &bull; Submitted on {sub.submittedAt}</span>
                          </div>
                        </div>

                        {sub.notes && (
                          <div className="sub-notes">
                            <strong>Student Note:</strong> {sub.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setSelectedAssignmentForReview(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
