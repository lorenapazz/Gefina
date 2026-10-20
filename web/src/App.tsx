import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router"
import DashboardPage from "./DashboardPage";
import InvoicePage from "./InvoicePage";

export default function App(){
    return <>
<BrowserRouter>
<nav>
<Link to="/">Painel Inicial</Link>
<Link to="/faturas">Faturas</Link>


</nav>
<Routes>
    <Route path="/" element={<DashboardPage/>} />
    <Route path="/faturas" element={<DashboardPage/>} />
</Routes>
</BrowserRouter>;
    </>;
}