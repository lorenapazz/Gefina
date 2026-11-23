import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

import DashboardPage from './DashboardPage';
import InvoicePage from './InvoicePage';

export default function App() {
  function apply(state: boolean): string {
    const base = 'block px-3 py-2 rounded-control';

    if (state) return `${base} bg-surface-raised font-medium`;

    return `${base} text-text-muted hover:bg-surface-raised hover:text-text`;
  }

  return (
    <BrowserRouter>
      <aside className="fixed w-60 h-full flex flex-col gap-8 p-6 border border-border bg-surface">
        <header className="text-xl font-bold uppercase text-center">
          Gefina
        </header>
        <nav>
          <ul className="flex flex-col gap-1">
            <li>
              <NavLink
                className={({ isActive }) => apply(isActive)}
                to="/"
              >
                Painel Inicial
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => apply(isActive)}
                to="/faturas"
              >
                Faturas
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="ml-60 p-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/faturas" element={<InvoicePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
