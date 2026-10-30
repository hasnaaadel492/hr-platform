import { createClient } from '@/lib/supabase/server';
import { Users, Calendar, Wallet, CheckCircle2 } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. جلب عدد الموظفين الحقيقي
  const { count: employeesCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. جلب عدد إجازات "قيد الانتظار" (pending) الحقيقي
  const { count: pendingLeavesCount } = await supabase
    .from('leaves')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // 3. جلب مسيرات الرواتب لحساب الإجمالي الفعلي
  const { data: payrolls } = await supabase
    .from('payrolls')
    .select('net_salary');

  const totalPayroll = payrolls?.reduce((acc, curr) => acc + (Number(curr.net_salary) || 0), 0) || 0;

  return (
    <div className="space-y-8" dir="rtl">
      {/* رأس الصفحة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          نظرة عامة على النظام وموظفي الشركة 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          إدارة شاملة للموظفين وإحصائيات الأداء والرواتب الحقيقية.
        </p>
      </div>

      {/* بطاقات الإحصائيات الديناميكية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* إجمالي الموظفين */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">إجمالي الموظفين</p>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              {employeesCount || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* طلبات الإجازات المعلقة */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">طلبات الإجازات المعلقة</p>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
              {pendingLeavesCount || 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* إجمالي الرواتب الشهرية الصادرة */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">إجمالي الرواتب الشهرية</p>
            <h3 className="text-3xl font-extrabold text-green-600 dark:text-green-400 mt-2">
              ${totalPayroll.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* قسم ترحيبي أو إضافي */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">منصة حسناء للتمويل وإدارة الموارد البشرية تعمل بكفاءة!</h2>
          <p className="text-xs text-blue-100 max-w-xl">
            جميع الأرقام والعمليات مرتبطة بقاعدة بيانات Supabase مباشرة بشكل لحظي وآمن.
          </p>
        </div>
        <CheckCircle2 className="w-16 h-16 text-blue-200/40 hidden sm:block" />
      </div>
    </div>
  );
}