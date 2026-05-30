import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Product from "./components/Product"
import Warehouse from "./components/Warehouse"
import Transactions from "./components/Transactions"
import Reports from "./components/Reports"

// Layout wrapper inside same file
function Layout({ children }) {

  const location = useLocation()

  // Hide sidebar on login/register
  const hideSidebar =
    location.pathname === "/" ||
    location.pathname === "/register"

  return (

    <div className="flex">

      {!hideSidebar && <Sidebar />}

      <div className={hideSidebar ? "w-full" : "ml-64 w-full p-6 bg-gray-100 min-h-screen"}>

        {children}

      </div>

    </div>

  )
}

function App() {

  return (

    <BrowserRouter>

      <Layout>

        <Routes>

          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* SYSTEM */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<Product />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />

        </Routes>

      </Layout>

    </BrowserRouter>

  )
}

export default App