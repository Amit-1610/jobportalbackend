const mongoose = require("mongoose");

const collegeStudentProfileSchema = new mongoose.Schema({
  college: { type: mongoose.Schema.Types.ObjectId, ref: "CollegeProfile", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who added this profile

  // 1. Basic Personal Info
  fullName: { type: String, required: true },
  dob: Date,
  gender: String,
  email: { type: String, required: true },
  phone: String,
  address: {
    permanent: String,
    current: String,
  },
  nationality: String,

  // 2. Identification
  studentId: String,
  aadhaar: String,
  photo: String, // cloud url

  // 3. Education
  course: String,
  department: String,
  collegeRollNo: String,
  collegeName: String,
  campusLocation: String,
  yearOfAdmission: String,
  expectedGraduation: String,
  currentSemester: String,
  academicPerformance: String,
  cgpa: String,
  backlogs: String,
  boardNames: [String],
  yearOfPassing: String,
  previousDiploma: String,

  // 4. Skills
  skills: [String],

  // 5. Projects & Internships
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    role: String,
    links: [String]
  }],
  internships: [{
    company: String,
    duration: String,
    responsibilities: String
  }],

  // 6. Achievements & Activities
  awards: [String],
  events: [String],
  responsibilities: [String],

  // 7. Career Preferences
  jobType: [String], // Full-time, Internship, Contract
  preferredIndustry: [String],
  preferredLocation: [String],
  willingToRelocate: Boolean,

  // 8. Other Details
  languages: [{
    name: String,
    proficiency: String
  }],
  hobbies: [String],
  socialLinks: [String],
  resume: String, // cloud url
  declaration: { type: Boolean, default: false },

  // 9. Placement-specific
  consentForData: { type: Boolean, default: false },
  agreementToPolicies: { type: Boolean, default: false },
  parentContact: {
    name: String,
    phone: String,
    email: String,
  },

  // 10. Analytics
  attendance: String,
  medicalStatus: String,
  gapYears: String,

  // Selection Status
  selectionStatus: {
    type: String,
    enum: ['selected', 'not selected', 'pending', 'other'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model("CollegeStudentProfile", collegeStudentProfileSchema);
