
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink
} from "react-router";

import DashboardPage from "./DashboardPage";
import InvoicePage from "./InvoicePage";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">

                <aside className="sidebar">
                    <header className="brand">
                        Gefina
                    </header>

                    <nav className="menu">
                        <NavLink to="/">Painel Inicial</NavLink>
                        <NavLink to="/faturas">Faturas</NavLink>
                    </nav>
                </aside>

                <main className="content">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/faturas" element={<InvoicePage />} />
                    </Routes>
                </main>

            </div>
        </BrowserRouter>
    );
}
