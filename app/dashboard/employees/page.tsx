export const instant = false;

import { createClient } from '@/lib/supabase/server';
import EmployeesClient from '@/components/employees/EmployeesClient';

export default async function EmployeesPage() {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return <EmployeesClient employees={employees || []} />;
}