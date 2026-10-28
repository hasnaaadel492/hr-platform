'use client';

import { useState } from 'react';
import { Plus, Users, Search, Edit3, Trash2 } from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface EmployeesClientProps {
  employees: any[];
}

export default function EmployeesClient({ employees }: EmployeesClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // فلترة الموظفين بناءً على البحث
  const filteredEmployees = employees.filter((emp) => 
    emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // دالة الحذف
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    
    setDeletingId(id);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert('خطأ أثناء الحذف: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الموظفين</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وإدارة جميع موظفي الشركة والصلاحيات</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          إضافة موظف جديد
        </button>
      </div>

      {/* شريط البحث */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-3 transition-colors">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، البريد الإلكتروني، أو المسمى الوظيفي..."
          className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* جدول عرض الموظفين */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">الموظف</th>
                <th className="py-4 px-6">المسمى الوظيفي</th>
                <th className="py-4 px-6">القسم</th>
                <th className="py-4 px-6">الراتب</th>
                <th className="py-4 px-6">الصلاحية</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                      <p className="font-semibold">لا توجد نتائج مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        {emp.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{emp.full_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{emp.job_title || 'غير محدد'}</td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                        عام
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                      {emp.salary ? `$${emp.salary.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emp.role === 'admin' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300' :
                        emp.role === 'hr' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          disabled={deletingId === emp.id}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="حذف الموظف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal إضافة موظف */}
      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}