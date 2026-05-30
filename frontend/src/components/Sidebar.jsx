import { Link } from 'react-router-dom'

function Sidebar() {

    const logout = () => {
        localStorage.removeItem('token')
        window.location.href = '/'
    }

    return (

        <div className="h-screen w-64 bg-blue-800 text-white fixed">

            <h1 className="text-2xl font-bold p-5 border-b border-blue-600">
                StockHub SMS
            </h1>

            <div className="flex flex-col p-4 gap-4">

                <Link className="hover:bg-blue-600 p-2 rounded" to="/product">
                    Product
                </Link>

                <Link className="hover:bg-blue-600 p-2 rounded" to="/warehouse">
                    Warehouse
                </Link>

                <Link className="hover:bg-blue-600 p-2 rounded" to="/transactions">
                    Transactions
                </Link>

                <Link className="hover:bg-blue-600 p-2 rounded" to="/reports">
                    Reports
                </Link>

                <button
                    onClick={logout}
                    className="bg-red-500 p-2 rounded mt-10"
                >
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Sidebar