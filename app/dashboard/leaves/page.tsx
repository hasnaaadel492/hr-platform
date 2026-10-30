import { createClient } from '@/lib/supabase/server';
import LeavesClient from '@/components/leaves/LeavesClient';

export default async function LeavesPage() {
  const supabase = await createClient();

  // جلب الإجازات
  const { data: leaves } = await supabase
    .from('leaves')
    .select('*')
    .order('created_at', { ascending: false });

  // جلب الموظفين لربطهم بقائمة الاختيار
  const { data: employees } = await supabase
    .from('profiles')
    .select('id, full_name');

  return <LeavesClient leaves={leaves || []} employees={employees || []} />;
}