import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function ProjectLayout() {
  return (
    <div className="flex min-h-screen bg-warm-100">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
