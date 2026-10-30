'use client';

import { useState } from 'react';
import { Plus, Wallet, Trash2, CheckCircle, Clock } from 'lucide-react';
import AddPayrollModal from './AddPayrollModal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PayrollClientProps {
  payrolls: any[];
  employees: any[];
}

export default function PayrollClient({ payrolls, employees }: PayrollClientProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [payrollToDelete, setPayrollToDelete] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = (item: any) => {
    setPayrollToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!payrollToDelete) return;
    setDeletingId(payrollToDelete.id);

    try {
      const { error } = await supabase.from('payrolls').delete().eq('id', payrollToDelete.id);
      if (error) throw error;
      toast.success('تم حذف مسير الراتب بنجاح');
      setDeleteModalOpen(false);
      setPayrollToDelete(null);
      router.refresh();
    } catch (err: any) {
      toast.error('حدث خطأ أثناء الحذف: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // إجمالي المبالغ المدفوعة
  const totalPaid = payrolls.reduce((acc, curr) => acc + (Number(curr.net_salary) || 0), 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الرواتب والمسيرات</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">متابعة المسيرات السهرية والبدلات والخصومات</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          إصدار مسير راتب
        </button>
      </div>

      {/* بطاقة إجمالي مسيرات الرواتب */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">إجمالي المسيرات الصادرة</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">${totalPaid.toLocaleString()}</h3>
          </div>
        </div>
        <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
          عدد المسيرات: {payrolls.length}
        </span>
      </div>

      {/* جدول المسيرات */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">الموظف</th>
                <th className="py-4 px-6">الراتب الأساسي</th>
                <th className="py-4 px-6">البدلات</th>
                <th className="py-4 px-6">الخصومات</th>
                <th className="py-4 px-6">صافي الراتب</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Wallet className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                      <p className="font-semibold">لا توجد مسيرات رواتب مضافة حالياً</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payrolls.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{item.employee_name}</td>
                    <td className="py-4 px-6">${Number(item.base_salary).toLocaleString()}</td>
                    <td className="py-4 px-6 text-green-600 dark:text-green-400">+${Number(item.allowances).toLocaleString()}</td>
                    <td className="py-4 px-6 text-red-500 dark:text-red-400">-${Number(item.deductions).toLocaleString()}</td>
                    <td className="py-4 px-6 font-extrabold text-blue-600 dark:text-blue-400">${Number(item.net_salary).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'paid' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300' :
                        'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      }`}>
                        {item.status === 'paid' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {item.status === 'paid' ? 'تم الصرف' : 'قيد المعالجة'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => confirmDelete(item)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        title="حذف المسير"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأكيد حذف المسير</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">هل أنت متأكد من رغبتك في حذف مسير الراتب الخاص بالموضف <span className="font-semibold text-gray-700 dark:text-gray-200">"{payrollToDelete?.employee_name}"</span>؟</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={deletingId === payrollToDelete?.id}
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingId === payrollToDelete?.id ? 'جاري الحذف...' : 'نعم، قم بالحذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddPayrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} employees={employees} />
    </div>
  );
}