import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {

    const token = localStorage.getItem("token")

    const [products, setProducts] = useState(0)
    const [warehouses, setWarehouses] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [recent, setRecent] = useState([])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {

        const p = await axios.get("http://localhost:5000/products", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const w = await axios.get("http://localhost:5000/warehouses", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const t = await axios.get("http://localhost:5000/transactions", {
            headers: { Authorization: `Bearer ${token}` }
        })

        setProducts(p.data.length)
        setWarehouses(w.data.length)
        setTransactions(t.data)

        // recent 5 transactions
        setRecent(t.data.slice(0, 5))
    }

    const stockIN = transactions.filter(t => t.transactionType === "IN").length
    const stockOUT = transactions.filter(t => t.transactionType === "OUT").length

    return (

        <div className="p-6">

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-6">
                Stock Management Dashboard
            </h1>

            {/* STATS CARDS */}
            <div className="grid grid-cols-5 gap-4 mb-6">

                <div className="bg-blue-600 text-white p-4 rounded">
                    <h2 className="text-xl">Products</h2>
                    <p className="text-2xl">{products}</p>
                </div>

                <div className="bg-green-600 text-white p-4 rounded">
                    <h2 className="text-xl">Warehouses</h2>
                    <p className="text-2xl">{warehouses}</p>
                </div>

                <div className="bg-purple-600 text-white p-4 rounded">
                    <h2 className="text-xl">Transactions</h2>
                    <p className="text-2xl">{transactions.length}</p>
                </div>

                <div className="bg-yellow-500 text-white p-4 rounded">
                    <h2 className="text-xl">Stock IN</h2>
                    <p className="text-2xl">{stockIN}</p>
                </div>

                <div className="bg-red-500 text-white p-4 rounded">
                    <h2 className="text-xl">Stock OUT</h2>
                    <p className="text-2xl">{stockOUT}</p>
                </div>

            </div>

            {/* SYSTEM FLOW VISUAL */}
            <div className="bg-white p-4 rounded shadow mb-6">

                <h2 className="text-xl font-bold mb-3">System Flow</h2>

                <div className="flex items-center justify-between">

                    <div className="bg-blue-100 p-3 rounded">
                        Product
                    </div>

                    <span>➡</span>

                    <div className="bg-green-100 p-3 rounded">
                        Warehouse
                    </div>

                    <span>➡</span>

                    <div className="bg-purple-100 p-3 rounded">
                        Stock Transaction
                    </div>

                    <span>➡</span>

                    <div className="bg-yellow-100 p-3 rounded">
                        Reports
                    </div>

                </div>

            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-white p-4 rounded shadow">

                <h2 className="text-xl font-bold mb-3">
                    Recent Transactions
                </h2>

                <table className="w-full border">

                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Warehouse</th>
                            <th>Qty</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recent.map((r, i) => (
                            <tr key={i} className="text-center">
                                <td>{r.productName}</td>
                                <td>{r.warehouseName}</td>
                                <td>{r.quantityMoved}</td>
                                <td>{r.transactionType}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    )
}

export default Dashboard