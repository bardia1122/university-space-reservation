import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'داشبورد',
  '/spaces': 'فضاهای دانشگاه',
  '/my-reservations': 'رزروهای من',
  '/suggestions': 'پیشنهادات',
  '/admin': 'داشبورد مدیریت',
  '/admin/reservations': 'مدیریت رزروها',
  '/admin/spaces': 'مدیریت فضاها',
  '/admin/complaints': 'شکایات',
  '/admin/analytics': 'آمار و گزارش',
  '/admin/users': 'مدیریت کاربران',
};

export function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const title =
    pageTitles[pathname] ??
    (pathname.startsWith('/spaces/') ? 'جزئیات فضا' : 'سامانه رزرو فضا');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="lg:mr-64 flex flex-col min-h-screen">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
