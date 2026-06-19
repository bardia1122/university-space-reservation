import { useState, type FormEvent } from 'react';
import { Menu, Bell, Home, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/spaces?q=${encodeURIComponent(q)}` : '/spaces');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between gap-3 px-4 lg:px-6 sticky top-0 z-20 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h1>
      </div>

      {/* Global search */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md hidden sm:block">
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی فضا..."
          className="input-field pr-10 py-2 text-sm"
          aria-label="جستجوی فضا"
        />
      </form>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile search shortcut */}
        <button
          onClick={() => navigate('/spaces')}
          className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="جستجو"
        >
          <Search size={18} />
        </button>
        <ThemeToggle />
        <Link
          to="/"
          title="مشاهده صفحه اصلی"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary-700 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-300"
        >
          <Home size={18} />
          <span className="hidden md:inline">صفحه اصلی</span>
        </Link>
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative dark:text-slate-400 dark:hover:bg-slate-800">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-800">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900/40">
            <span className="text-primary-700 font-semibold text-xs dark:text-primary-300">
              {user?.full_name?.[0] ?? '?'}
            </span>
          </div>
          <span className="text-sm text-gray-700 font-medium dark:text-slate-200">
            {user?.full_name}
          </span>
        </div>
      </div>
    </header>
  );
}
