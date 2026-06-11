import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Building2, CalendarDays,
  Lightbulb, ShieldCheck, LogOut, X,
  BarChart3, Users, AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../common/Logo';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const studentNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
  { to: '/spaces', icon: Building2, label: 'فضاها' },
  { to: '/my-reservations', icon: CalendarDays, label: 'رزروهای من' },
  { to: '/suggestions', icon: Lightbulb, label: 'پیشنهادات' },
];

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'داشبورد', end: true },
  { to: '/admin/reservations', icon: CalendarDays, label: 'مدیریت رزروها' },
  { to: '/admin/spaces', icon: Building2, label: 'مدیریت فضاها' },
  { to: '/admin/complaints', icon: AlertCircle, label: 'شکایات' },
  { to: '/admin/analytics', icon: BarChart3, label: 'آمار و گزارش' },
  { to: '/admin/users', icon: Users, label: 'کاربران' },
];

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const nav = isAdmin ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/', { replace: true });
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
        <Logo size={36} to="/" />
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {isAdmin && (
          <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            پنل مدیریت
          </p>
        )}
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={(item as { end?: boolean }).end}
            onClick={onClose}
            className={({ isActive }) =>
              clsx('nav-item', isActive ? 'nav-item-active' : 'nav-item-inactive')
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                پنل دانشجویی
              </p>
            </div>
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                clsx('nav-item', isActive ? 'nav-item-active' : 'nav-item-inactive')
              }
            >
              <ShieldCheck size={18} />
              <span>مشاهده به عنوان دانشجو</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.full_name?.[0] ?? '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-item nav-item-inactive w-full mt-1 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 fixed top-0 right-0 h-full z-30">
        {content}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="relative flex flex-col w-72 h-full mr-auto animate-slide-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
