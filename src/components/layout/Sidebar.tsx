import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Magnet,
  Layers,
  Cable,
  Activity,
  Radio,
  Moon,
  Sun,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useThemeStore, useProgressStore } from '@/store/progressStore';
import { MODULE_URLS } from '@/constants/modules';

const navigationLinks = [
  { to: '/', icon: Home, label: 'Overview', sectionId: 'overview' },
  { to: '/transformers', icon: Magnet, label: 'Transformers', sectionId: 'transformers' },
  { to: '/lumped-distributed', icon: Layers, label: 'Lumped to Distributed', sectionId: 'lumped-distributed' },
  { to: '/transmission-lines', icon: Cable, label: 'Transmission Lines', sectionId: 'transmission-lines' },
  { to: '/transients', icon: Activity, label: 'Transients', sectionId: 'transients' },
  { to: '/antennas', icon: Radio, label: 'Antennas', sectionId: 'antennas' },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const sections = useProgressStore((s) => s.sections);
  const currentIndex = navigationLinks.findIndex(link =>
    link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
  );

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-engineering-blue-600 to-engineering-blue-800">
        <h1 className="text-xl font-bold text-white">EM&AC Lab</h1>
        <p className="text-sm text-engineering-blue-200 mt-1">Module 3: Transmission Lines</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto" aria-label="Learning path">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">Learning Path</p>
        <ul className="space-y-1">
          {navigationLinks.map((link, index) => {
            const progress = sections[link.sectionId];
            const isVisited = progress?.visited;

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm',
                      isActive
                        ? 'bg-engineering-blue-50 dark:bg-engineering-blue-900/30 text-engineering-blue-700 dark:text-engineering-blue-300 font-semibold border-l-3 border-engineering-blue-600'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    )
                  }
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors relative',
                    index === currentIndex
                      ? 'bg-engineering-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  )}>
                    <link.icon className="w-3.5 h-3.5" />
                    {isVisited && index !== currentIndex && (
                      <CheckCircle className="w-3 h-3 text-green-500 absolute -top-0.5 -right-0.5" />
                    )}
                  </div>
                  <span className="truncate">{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Course Modules */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700">
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-2">
          Course Modules
        </p>
        <div className="space-y-1">
          <a
            href={MODULE_URLS.module1}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">1</span>
            EM Fundamentals
            <ExternalLink size={10} className="ml-auto opacity-50" />
          </a>
          <a
            href={MODULE_URLS.module2}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">2</span>
            Circuit Analysis
            <ExternalLink size={10} className="ml-auto opacity-50" />
          </a>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-engineering-blue-50 dark:bg-engineering-blue-900/20 text-engineering-blue-700 dark:text-engineering-blue-300 text-xs font-semibold">
            <span className="w-5 h-5 rounded-full bg-engineering-blue-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
            Transmission Lines
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium tracking-wide">
          CA/EM&CA Course
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-0.5">
          &copy; 2026 LUT University
        </p>
      </div>
    </aside>
  );
}
