const mongoose = require("mongoose");

const agencyStudentProfileSchema = new mongoose.Schema({
  agency: { type: mongoose.Schema.Types.ObjectId, ref: "AgencyProfile", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who added this student

  // 1. Personal Details
  fullName: { type: String, required: true },
  guardianName: String,
  dob: Date,
  gender: String,
  photo: String, // cloud url
  mobile: { type: String, required: true },
  altMobile: String,
  email: String,
  permanentAddress: String,
  currentAddress: String,

  // 2. Identification & Documentation
  aadhaar: String,
  casteCertificate: String,
  incomeCertificate: String,
  disabilityCertificate: String,

  // 3. Socio-Economic Details
  religion: String,
  category: String,
  familyIncome: String,
  maritalStatus: String,
  isBPL: Boolean,
  isSHGMember: Boolean,

  // 4. Education
  highestQualification: String,
  tenthBoard: String,
  tenthYear: String,
  tenthMarks: String,
  twelfthBoard: String,
  twelfthYear: String,
  twelfthMarks: String,
  diplomaDetails: String,
  gradDetails: String,

  // 5. Training Program Details
  agencyName: String,
  centerName: String,
  centerCode: String,
  trainingCourse: String,
  nsqfLevel: String,
  govtProjectName: String,
  schemeId: String,
  batchId: String,
  batchStartDate: String,
  batchEndDate: String,
  attendance: String,
  certificationDetails: {
    certNumber: String,
    certDate: String,
  },

  // 6. Employment Preferences
  jobRolePreference: String,
  preferredSector: String,
  preferredLocation: [String],
  willingToRelocate: Boolean,
  expectedSalary: String,

  // 7. Employment Status (Post-Training)
  employmentStatus: {
    type: String,
    enum: ['Employed', 'Unemployed', 'Entrepreneurship'],
    default: 'Unemployed'
  },
  employmentDetails: {
    employerName: String,
    jobRole: String,
    location: String,
    joiningDate: String,
    salary: String
  },

  // 8. Additional Details
  languages: [String],
  computerSkills: { type: Boolean, default: false },
  softSkillsCompleted: { type: Boolean, default: false },
  priorWorkExperience: String,

  // 9. Banking Details
  bankAccountNumber: String,
  bankNameBranch: String,
  ifscCode: String,
  accountHolderName: String,

  // 10. Uploads
  resume: String, // cloud url (optional)
  aadhaarScan: String,
  qualificationCertificate: String,
  skillCertificate: String,

  // 11. Consent & Declarations
  consent: { type: Boolean, default: false },
  declaration: { type: Boolean, default: false },
  parentContact: {
    name: String,
    phone: String,
    email: String
  },

  // Placement selection status
  selectionStatus: {
    type: String,
    enum: ['selected', 'not selected', 'pending', 'other'],
    default: 'pending'
  },
}, { timestamps: true });

module.exports = mongoose.model("AgencyStudentProfile", agencyStudentProfileSchema);
