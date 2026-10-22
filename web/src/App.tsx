
import {
    BrowserRouter,
    Routes,
    Route,
    Link
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
                        <Link to="/">Painel Inicial</Link>
                        <Link to="/faturas">Faturas</Link>
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
