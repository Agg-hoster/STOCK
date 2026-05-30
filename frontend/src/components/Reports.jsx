import { useState } from "react"
import axios from "axios"

function Reports() {

    const token = localStorage.getItem("token")
    const [data, setData] = useState([])

    const load = async (type) => {

        const res = await axios.get(
            `http://localhost:5000/reports/${type}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )

        setData(res.data)
    }

    return (

        <div className="p-6">

            <div className="flex gap-3 mb-4">

                <button onClick={() => load("daily")} className="bg-blue-600 text-white px-4">
                    Daily
                </button>

                <button onClick={() => load("weekly")} className="bg-green-600 text-white px-4">
                    Weekly
                </button>

                <button onClick={() => load("monthly")} className="bg-purple-600 text-white px-4">
                    Monthly
                </button>

            </div>

            <table className="w-full border">

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Warehouse</th>
                        <th>Qty</th>
                        <th>Type</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((r, i) => (
                        <tr key={i} className="text-center">
                            <td>{r.productName}</td>
                            <td>{r.warehouseName}</td>
                            <td>{r.quantityMoved}</td>
                            <td>{r.transactionType}</td>
                            <td>{r.transactionDate}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    )
}

export default Reports