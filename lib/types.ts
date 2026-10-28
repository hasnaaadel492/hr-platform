export type UserRole = 'admin' | 'hr' | 'employee';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department_id: string | null;
  job_title: string | null;
  salary: number | null;
  joined_date: string | null;
  avatar_url: string | null;
  created_at: string;
  departments?: Department; // للربط (Join)
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  created_at: string;
  profiles?: Profile; // للربط
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  profiles?: Profile; // للربط
}