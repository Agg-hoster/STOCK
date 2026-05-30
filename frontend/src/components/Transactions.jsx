import { useEffect, useState } from "react"
import axios from "axios"

function Transactions() {

    const token = localStorage.getItem("token")

    const [products, setProducts] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [data, setData] = useState([])

    const [form, setForm] = useState({
        productCode: "",
        warehouseCode: "",
        transactionDate: "",
        quantityMoved: "",
        transactionType: "IN"
    })

    const [editId, setEditId] = useState(null)

    const loadAll = async () => {

        const p = await axios.get("http://localhost:5000/products", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const w = await axios.get("http://localhost:5000/warehouses", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const t = await axios.get("http://localhost:5000/transactions", {
            headers: { Authorization: `Bearer ${token}` }
        })

        setProducts(p.data)
        setWarehouses(w.data)
        setData(t.data)
    }

    useEffect(() => {
        loadAll()
    }, [])

    const submit = async (e) => {
        e.preventDefault()

        if (editId) {
            await axios.put(`http://localhost:5000/transactions/${editId}`, form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } else {
            await axios.post("http://localhost:5000/transactions", form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }

        setForm({
            productCode: "",
            warehouseCode: "",
            transactionDate: "",
            quantityMoved: "",
            transactionType: "IN"
        })

        setEditId(null)
        loadAll()
    }

    const edit = (t) => {
        setForm(t)
        setEditId(t.transactionId)
    }

    const remove = async (id) => {
        await axios.delete(`http://localhost:5000/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        loadAll()
    }

    return (

        <div>

            <form onSubmit={submit} className="grid grid-cols-5 gap-2 mb-4">

                <select onChange={e => setForm({ ...form, productCode: e.target.value })}>
                    <option>Select Product</option>
                    {products.map(p => (
                        <option value={p.productCode}>{p.productName}</option>
                    ))}
                </select>

                <select onChange={e => setForm({ ...form, warehouseCode: e.target.value })}>
                    <option>Select Warehouse</option>
                    {warehouses.map(w => (
                        <option value={w.warehouseCode}>{w.warehouseName}</option>
                    ))}
                </select>

                <input type="date"
                    onChange={e => setForm({ ...form, transactionDate: e.target.value })}
                />

                <input type="number"
                    placeholder="Qty"
                    onChange={e => setForm({ ...form, quantityMoved: e.target.value })}
                />

                <select onChange={e => setForm({ ...form, transactionType: e.target.value })}>
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                </select>

                <button className="bg-blue-600 text-white">
                    {editId ? "Update" : "Save"}
                </button>

            </form>

            <table className="w-full border">

                <tbody>
                    {data.map(t => (
                        <tr key={t.transactionId} className="text-center">

                            <td>{t.productName}</td>
                            <td>{t.warehouseName}</td>
                            <td>{t.quantityMoved}</td>
                            <td>{t.transactionType}</td>

                            <td>
                                <button onClick={() => edit(t)} className="bg-yellow-500 px-2">Edit</button>
                                <button onClick={() => remove(t.transactionId)} className="bg-red-500 px-2">Delete</button>
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    )
}

export default Transactions