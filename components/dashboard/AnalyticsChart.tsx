'use client';

export default function AnalyticsChart() {
  const monthsData = [
    { month: 'يناير', salary: 32000, height: '60%' },
    { month: 'فبراير', salary: 35000, height: '70%' },
    { month: 'مارس', salary: 38000, height: '75%' },
    { month: 'أبريل', salary: 42000, height: '85%' },
    { month: 'مايو', salary: 40000, height: '80%' },
    { month: 'يونيو', salary: 45200, height: '100%' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-colors h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">نمو مصروفات الرواتب (2026)</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">مقارنة تصاعدية لمصروفات الرواتب خلال النصف الأول</p>
        </div>
        <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
          محدث آلياً
        </span>
      </div>

      {/* الأعمدة البيانية */}
      <div className="h-60 flex items-end justify-between gap-4 pt-6 px-2 border-b border-gray-100 dark:border-gray-800">
        {monthsData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              ${item.salary.toLocaleString()}
            </span>
            
            <div 
              style={{ height: item.height }}
              className="w-full max-w-[45px] bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-lg transition-all duration-300 group-hover:opacity-90 shadow-sm"
            ></div>
            
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>الحد الأدنى: $32,000</span>
        <span className="font-bold text-gray-800 dark:text-gray-200">الذروة الحالية: $45,200 (يونيو)</span>
      </div>
    </div>
  );
}