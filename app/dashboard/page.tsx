export const instant = false;

import { createClient } from '@/lib/supabase/server';
import { Users, UserCheck, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: employees } = await supabase
    .from('profiles')
    .select('*, departments(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8" dir="rtl">
      {/* الترويسة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">نظرة عامة على النظام وموظفي الشركة 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">إدارة شاملة للموظفين وإحصائيات الأداء والرواتب.</p>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">إجمالي الموظفين</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{employees?.length || 24}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">الحاضرون اليوم</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">21</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">طلبات الإجازات المعلقة</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">3</h3>
          </div>
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">إجمالي الرواتب الشهرية</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">$45,200</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* قسم الرسم البياني والنشاطات الأخيرة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        {/* كارت آخر طلبات الإجازات */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">أحدث طلبات الإجازات</h3>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">أحمد محمود</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">إجازة سنوية (3 أيام)</p>
              </div>
              <span className="px-2.5 py-1 bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> قيد الانتظار
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">سارة علي</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">إجازة مرضية (يوم واحد)</p>
              </div>
              <span className="px-2.5 py-1 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> مقبول
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">عمر خالد</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">إجازة بدون راتب</p>
              </div>
              <span className="px-2.5 py-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 text-xs font-medium rounded-full flex items-center gap-1">
                <XCircle className="w-3 h-3" /> مرفوض
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}