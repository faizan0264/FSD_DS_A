import React, { createContext, useContext, useState, useEffect } from "react";
import initialData from "../data/initialData.json";

const PortalContext = createContext();

const STORAGE_KEY = "student_admin_portal_data_v4";
const AUTH_KEY = "student_admin_portal_auth_v4";

export const PortalProvider = ({ children }) => {
  // Load data from localStorage or fallback to initial JSON
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse stored JSON data, reverting to defaults", e);
    }
    return initialData;
  });

  // Load authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_KEY);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.error("Failed to parse auth session", e);
    }
    return null;
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Sync data to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error saving data to localStorage", e);
    }
  }, [data]);

  // Cross-tab synchronization: if another tab (e.g. Admin) updates data, Student tab syncs instantly!
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData(parsed);
        } catch (err) {
          console.error("Storage sync failed across tabs", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync auth session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error("Error saving auth session", e);
    }
  }, [currentUser]);

  // --- Auth Methods ---
  const login = (username, password, role) => {
    const user = data.users.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      showToast("Invalid credentials or role selection. Please verify your login details.", "error");
      return false;
    }

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`, "success");
    return true;
  };

  const quickLogin = (role, studentId = null) => {
    if (role === "admin") {
      const adminUser = data.users.find((u) => u.role === "admin") || {
        id: "usr-admin-1",
        username: "admin",
        role: "admin",
        name: "Administrator",
        email: "admin@portal.edu"
      };
      setCurrentUser(adminUser);
      showToast("Logged in as Admin Demo", "success");
    } else {
      const studentUser = studentId
        ? data.users.find((u) => u.role === "student" && u.studentId === studentId)
        : data.users.find((u) => u.role === "student");

      if (studentUser) {
        setCurrentUser(studentUser);
        showToast(`Logged in as Student Demo (${studentUser.name})`, "success");
      } else {
        showToast("No demo student account found", "error");
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("Logged out successfully", "info");
  };

  // --- Admin Methods ---
  // 1. Add Student
  const addStudent = (studentData) => {
    const course = studentData.course || "B.Tech";
    const courseCode = course === "B.Tech" ? "BT" : course;
    const branch = studentData.branch || "CSE";
    const sec = studentData.section || "A";
    const year = studentData.year || "1st Year";
    const randNum = Math.floor(10 + Math.random() * 90);
    const newStudentId = `STU-${courseCode}-${branch}-${sec}${randNum}`;
    const newStudent = {
      id: newStudentId,
      name: studentData.name.trim(),
      email: studentData.email.trim(),
      rollNumber: studentData.rollNumber?.trim() || `${courseCode}-${branch}-2026-${sec}${randNum}`,
      course: course,
      branch: branch,
      branchName: studentData.branchName || branch,
      department: `${course} - ${branch}`,
      year: year,
      section: sec,
      semester: studentData.semester || "Semester 4",
      phone: studentData.phone?.trim() || "+91 98765-43210",
      joinDate: new Date().toISOString().split("T")[0]
    };

    // Auto-create a student user login for them
    const generatedUsername = `${studentData.name.trim().toLowerCase().split(" ")[0]}_${courseCode.toLowerCase()}_${branch.toLowerCase()}_${sec.toLowerCase()}${randNum}`;
    const newStudentUser = {
      id: `usr-${Date.now()}`,
      username: generatedUsername,
      password: "student123",
      role: "student",
      studentId: newStudentId,
      name: newStudent.name,
      email: newStudent.email,
      course: newStudent.course,
      branch: newStudent.branch,
      year: newStudent.year,
      section: newStudent.section
    };

    setData((prev) => ({
      ...prev,
      students: [newStudent, ...prev.students],
      users: [...prev.users, newStudentUser]
    }));

    showToast(`Student ${newStudent.name} (${newStudent.course} ${newStudent.branch} - ${newStudent.year} Sec ${newStudent.section}) added successfully!`, "success");
    return newStudent;
  };

  // 2. Delete Student
  const deleteStudent = (studentId) => {
    const studentToDelete = data.students.find((s) => s.id === studentId);
    if (!studentToDelete) return;

    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      users: prev.users.filter((u) => u.studentId !== studentId),
      attendance: prev.attendance.filter((a) => a.studentId !== studentId),
      submissions: prev.submissions.filter((sub) => sub.studentId !== studentId)
    }));

    // If currently logged-in student is deleted, log them out
    if (currentUser?.studentId === studentId) {
      setCurrentUser(null);
    }

    showToast(`Student ${studentToDelete.name} has been deleted.`, "info");
  };

  // 3. Attendance Management (Admin)
  const saveAttendanceBatch = (dateStr, statusMap) => {
    // statusMap: { [studentId]: { status: "Present"|"Absent"|"Late", remark: string } }
    setData((prev) => {
      // Remove any existing records for this date
      const filtered = prev.attendance.filter((item) => item.date !== dateStr);
      const newRecords = Object.entries(statusMap).map(([studentId, info], idx) => ({
        id: `att-${dateStr}-${studentId}-${idx}`,
        date: dateStr,
        studentId,
        status: info.status || "Present",
        remark: info.remark || ""
      }));

      return {
        ...prev,
        attendance: [...filtered, ...newRecords]
      };
    });

    showToast(`Attendance for ${dateStr} saved successfully!`, "success");
  };

  // 4. Assignment Upload (Admin)
  const addAssignment = (assignmentData) => {
    const newAssignment = {
      id: `ASG-${Math.floor(200 + Math.random() * 800)}`,
      title: assignmentData.title.trim(),
      subject: assignmentData.subject.trim(),
      description: assignmentData.description.trim(),
      dueDate: assignmentData.dueDate,
      points: Number(assignmentData.points) || 100,
      attachmentName: assignmentData.attachmentName || "assignment_instructions.pdf",
      attachmentSize: assignmentData.attachmentSize || "920 KB",
      department: assignmentData.department || "All Departments",
      createdDate: new Date().toISOString().split("T")[0]
    };

    setData((prev) => {
      const updated = {
        ...prev,
        assignments: [newAssignment, ...(prev.assignments || [])]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
      } catch (err) {
        console.error("Failed to sync to localStorage", err);
      }
      return updated;
    });

    showToast(`Assignment "${newAssignment.title}" uploaded successfully!`, "success");
    return newAssignment;
  };

  const deleteAssignment = (assignmentId) => {
    const target = data.assignments.find((a) => a.id === assignmentId);
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== assignmentId),
      submissions: prev.submissions.filter((s) => s.assignmentId !== assignmentId)
    }));
    showToast(`Assignment "${target?.title || assignmentId}" deleted.`, "info");
  };

  // --- Student Methods ---
  // Submit Assignment (Upload submission)
  const submitAssignment = ({ assignmentId, fileName, notes, fileSize }) => {
    if (!currentUser || currentUser.role !== "student") return;

    const studentRecord = data.students.find((s) => s.id === currentUser.studentId);
    const studentName = studentRecord?.name || currentUser.name;

    const newSubmission = {
      id: `SUB-${Date.now().toString().slice(-5)}`,
      assignmentId,
      studentId: currentUser.studentId,
      studentName,
      fileName: fileName || "submission_file.pdf",
      fileSize: fileSize || "520 KB",
      notes: notes || "Submitted solution.",
      submittedAt: new Date().toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "Submitted",
      grade: "Pending Review"
    };

    setData((prev) => {
      // Replace existing submission if already submitted
      const filtered = prev.submissions.filter(
        (s) => !(s.assignmentId === assignmentId && s.studentId === currentUser.studentId)
      );
      return {
        ...prev,
        submissions: [newSubmission, ...filtered]
      };
    });

    showToast(`Assignment submitted successfully!`, "success");
  };

  // --- Data Management (JSON utilities) ---
  const resetToDefaultData = () => {
    setData(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData, null, 2));
    showToast("Reset all portal data to default JSON records.", "info");
  };

  const exportDataAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `student_portal_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("JSON data file downloaded successfully!", "success");
  };

  return (
    <PortalContext.Provider
      value={{
        data,
        currentUser,
        toast,
        login,
        quickLogin,
        logout,
        addStudent,
        deleteStudent,
        saveAttendanceBatch,
        addAssignment,
        deleteAssignment,
        submitAssignment,
        resetToDefaultData,
        exportDataAsJSON,
        showToast
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
};
