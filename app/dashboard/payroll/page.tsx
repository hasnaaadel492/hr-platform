import { createClient } from '@/lib/supabase/server';
import PayrollClient from '@/components/payroll/PayrollClient';

export default async function PayrollPage() {
  const supabase = await createClient();

  const { data: payrolls } = await supabase
    .from('payrolls')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: employees } = await supabase
    .from('profiles')
    .select('id, full_name, salary');

  return <PayrollClient payrolls={payrolls || []} employees={employees || []} />;
}