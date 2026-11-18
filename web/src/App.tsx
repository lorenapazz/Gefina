
import { BrowserRouter, Routes, Route, NavLink } from "react-router";

import DashboardPage from "./DashboardPage";
import InvoicePage from "./InvoicePage";

export default function App() {
    function apply(state: boolean): string {
        const base = "block px-3 py-2 hover:bg-surface-raised hover:text-text rounded-content";

        if (state) return `${base} bg-surface-raised font-medium`;
        return `${base} text-text-muted`;
    }

    return (
        <BrowserRouter>
            <div>
                <aside className="fixed w-60 h-full flex flex-col gap-8 p-6 border-r border-border">
                    <header className="text-xl font-bold uppercase text-center">
                        Gefina
                    </header>

                    <nav className="flex flex-col gap-1">
                        <NavLink
                            className={({ isActive }) => apply(isActive)}
                            to="/"
                            end
                        >
                            Painel Inicial
                        </NavLink>

                        <NavLink
                            className={({ isActive }) => apply(isActive)}
                            to="/faturas"
                        >
                            Faturas
                        </NavLink>
                    </nav>
                </aside>

                <main className="ml-60 p-4">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/faturas" element={<InvoicePage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
