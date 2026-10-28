'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FileSpreadsheet, 
  LogOut,
  Building2
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
    { name: 'الموظفون', href: '/dashboard/employees', icon: Users },
    { name: 'الإجازات والطلبات', href: '/dashboard/leaves', icon: CalendarDays },
    { name: 'الرواتب والمسيرات', href: '/dashboard/payroll', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors" dir="rtl">
      {/* القائمة الجانبية - Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-colors">
        {/* الشعار */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-gray-800 dark:text-white">منصة الموارد البشرية</span>
        </div>

        {/* روابط الملاحة */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* زر الخروج */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* الجزء الرئيسي للمحتوى */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* الشريط العلوي - Navbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 transition-colors">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">لوحة التحكم الإدارية</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-gray-800">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                م
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">مدير النظام</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@company.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* المحتوى الديناميكي */}
       <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
  {children}
</main>
        
      </div>
    </div>
  );
}