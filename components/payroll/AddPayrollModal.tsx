'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, DollarSign, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AddPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: any[];
}

export default function AddPayrollModal({ isOpen, onClose, employees }: AddPayrollModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employee_name: '',
    base_salary: '',
    allowances: '0',
    deductions: '0',
    status: 'paid',
  });

  if (!isOpen) return null;

  // عند اختيار موظف، يتم تعبئة راتبه الأساسي تلقائياً
  const handleEmployeeChange = (name: string) => {
    const emp = employees.find((e) => e.full_name === name);
    setFormData({
      ...formData,
      employee_name: name,
      base_salary: emp?.salary ? String(emp.salary) : '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_name) {
      toast.error('يرجى اختيار الموظف');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from('payrolls').insert([
        {
          employee_name: formData.employee_name,
          base_salary: parseFloat(formData.base_salary) || 0,
          allowances: parseFloat(formData.allowances) || 0,
          deductions: parseFloat(formData.deductions) || 0,
          status: formData.status,
        },
      ]);

      if (error) throw error;

      toast.success('تم إصدار مسير الراتب بنجاح!');
      setFormData({ employee_name: '', base_salary: '', allowances: '0', deductions: '0', status: 'paid' });
      onClose();
      router.refresh();
    } catch (err: any) {
      toast.error('حدث خطأ أثناء حفظ المسير: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const netSalary = (parseFloat(formData.base_salary) || 0) + (parseFloat(formData.allowances) || 0) - (parseFloat(formData.deductions) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <DollarSign className="w-5 h-5" />
            <span>إصدار مسير راتب جديد</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">الموظف *</label>
            <select
              required
              value={formData.employee_name}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-sm cursor-pointer"
            >
              <option value="">-- اختر الموظف --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.full_name}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">الراتب الأساسي ($)</label>
              <input
                type="number"
                required
                value={formData.base_salary}
                onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">البدلات (+)</label>
              <input
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">الخصومات (-)</label>
              <input
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-sm"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 flex justify-between items-center">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300">إجمالي صافي الراتب:</span>
            <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">${netSalary.toLocaleString()}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">حالة الصرف</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none text-sm cursor-pointer"
            >
              <option value="paid">تم الصرف (Paid)</option>
              <option value="pending">قيد المعالجة (Pending)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">إلغاء</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ المسير'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}