import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdjacentModules } from '@/constants/modules';

interface ModuleNavigationProps {
  /** Section id of the current module (matches MODULE_SECTIONS / progress-store ids) */
  currentModuleId: string;
}

export function ModuleNavigation({ currentModuleId }: ModuleNavigationProps) {
  const { prev, next } = getAdjacentModules(currentModuleId);

  return (
    <nav className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200 dark:border-slate-700" aria-label="Module navigation">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Previous</p>
            <p>{prev.label}</p>
          </div>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          to={next.path}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-engineering-blue-600 dark:text-engineering-blue-400 hover:bg-engineering-blue-50 dark:hover:bg-engineering-blue-900/20 transition-colors"
        >
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">Next</p>
            <p>{next.label}</p>
          </div>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : <div />}
    </nav>
  );
}
