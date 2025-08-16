export type UserRole = "Admin" | "User"; // Admin = Employer, User = Employee

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole; // 'Admin' (Employer) or 'User' (Employee)
  avatar: string;
  active?: boolean;
}

export type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  assignee: string;
  timeSpent?: number;
  timeEstimate?: number;
  tags?: string[];
  updatedAt?: string;
}

export type ProjectStatus = "In Progress" | "Completed" | "On Hold";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  deadline: string;
  members: string[];
  teamId?: string;
}

export interface TeamMember {
  name: string;
  role: UserRole; // 'Admin' or 'User'
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

export type OrgUserStatus = "Active" | "Pending";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole; // 'Admin' or 'User'
  status: OrgUserStatus;
}

export type TimeEntryStatus = "Submitted" | "Approved" | "Rejected";

export interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  projectId: string;
  date: string;
  timeSpent: string; // format "hh:mm"
  notes: string;
  status: TimeEntryStatus;
}