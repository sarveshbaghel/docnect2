
export enum UserRole {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR'
}

export enum DocStatus {
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum DocType {
  ASSIGNMENT = 'Assignment',
  NOTES = 'Notes',
  RESEARCH = 'Research Paper',
  SYLLABUS = 'Syllabus'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  rollNumber?: string;
  branch?: string;
  year?: string;
}

export interface Document {
  id: string;
  fileName: string;
  subject: string;
  type: DocType;
  year: string;
  branch: string;
  uploadDate: string;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: UserRole;
  status: DocStatus;
  fileUrl: string; // Base64 or Blob URL for simulation
  remarks?: string;
  aiSummary?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
