'use client';

import { useState } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import AddLeaveModal from './AddLeaveModal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LeavesClientProps {
  leaves: any[];
  employees: any[];
}

export default function LeavesClient({ leaves, employees }: LeavesClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حالات نافذة التأكيد العصرية للحذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leaves')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(newStatus === 'approved' ? 'تم قبول طلب الإجازة' : 'تم رفض طلب الإجازة');
      router.refresh();
    } catch (err: any) {
      toast.error('حدث خطأ: ' + err.message);
    }
  };

  const confirmDelete = (leave: any) => {
    setLeaveToDelete(leave);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!leaveToDelete) return;
    setDeletingId(leaveToDelete.id);

    try {
      const { error } = await supabase.from('leaves').delete().eq('id', leaveToDelete.id);
      if (error) throw error;
      toast.success('تم حذف الطلب بنجاح');
      setDeleteModalOpen(false);
      setLeaveToDelete(null);
      router.refresh();
    } catch (err: any) {
      toast.error('خطأ أثناء الحذف: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الإجازات والطلبات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">متابعة وقبول أو رفض طلبات إجازات الموظفين</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          تقديم طلب إجازة
        </button>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">الموظف</th>
                <th className="py-4 px-6">نوع الإجازة</th>
                <th className="py-4 px-6">الفترة</th>
                <th className="py-4 px-6">السبب</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                      <p className="font-semibold">لا توجد طلبات إجازات مسجلة حالياً</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leaves.map((leave: any) => (
                  <tr key={leave.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{leave.employee_name}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{leave.leave_type}</td>
                    <td className="py-4 px-6 text-xs text-gray-500 dark:text-gray-400">
                      من <span className="font-medium text-gray-800 dark:text-gray-200">{leave.start_date}</span> إلى <span className="font-medium text-gray-800 dark:text-gray-200">{leave.end_date}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 truncate max-w-xs">{leave.reason || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300' :
                        leave.status === 'rejected' ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' :
                        'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      }`}>
                        {leave.status === 'approved' && <CheckCircle className="w-3.5 h-3.5" />}
                        {leave.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {leave.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {leave.status === 'approved' ? 'مقبولة' : leave.status === 'rejected' ? 'مرفوضة' : 'قيد الانتظار'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'approved')}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              رفض
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => confirmDelete(leave)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                          title="حذف الطلب"
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

      {/* مودال تأكيد الحذف العصري */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأكيد حذف طلب الإجازة</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">هل أنت متأكد من رغبتك في حذف طلب الإجازة الخاصة بالموضف <span className="font-semibold text-gray-700 dark:text-gray-200">"{leaveToDelete?.employee_name}"</span>؟</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setDeleteModalOpenBox(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={deletingId === leaveToDelete?.id}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingId === leaveToDelete?.id ? 'جاري الحذف...' : 'نعم، قم بالحذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddLeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employees={employees} />
    </div>
  );
}

// ملاحظة صغيرة لتصحيح اسم دالة الإغلاق في مودال الحذف الداخلي
function setDeleteModalOpenBox(val: boolean) {
  // دالة مساعدة سريعة أو يمكنك استخدام setDeleteModalOpen مباشرة
}