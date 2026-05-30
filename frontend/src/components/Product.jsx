import { useEffect, useState } from "react"
import axios from "axios"

function Product() {

    const token = localStorage.getItem("token")

    const [products, setProducts] = useState([])

    const [form, setForm] = useState({
        productName: "",
        category: "",
        quantityInStock: "",
        unitPrice: "",
        supplierName: "",
        dateReceived: ""
    })

    const [editId, setEditId] = useState(null)

    const load = async () => {
        const res = await axios.get("http://localhost:5000/products", {
            headers: { Authorization: `Bearer ${token}` }
        })
        setProducts(res.data)
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()

        if (editId) {
            await axios.put(`http://localhost:5000/products/${editId}`, form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } else {
            await axios.post("http://localhost:5000/products", form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }

        setForm({
            productName: "",
            category: "",
            quantityInStock: "",
            unitPrice: "",
            supplierName: "",
            dateReceived: ""
        })

        setEditId(null)
        load()
    }

    const edit = (p) => {
        setForm(p)
        setEditId(p.productCode)
    }

    const remove = async (id) => {
        await axios.delete(`http://localhost:5000/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        load()
    }

    return (

        <div>

            <form onSubmit={submit} className="grid grid-cols-3 gap-2 mb-5">

                <input className="border p-2" placeholder="Name"
                    value={form.productName}
                    onChange={e => setForm({ ...form, productName: e.target.value })}
                />

                <input className="border p-2" placeholder="Category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                />

                <input className="border p-2" placeholder="Qty"
                    value={form.quantityInStock}
                    onChange={e => setForm({ ...form, quantityInStock: e.target.value })}
                />

                <input className="border p-2" placeholder="Price"
                    value={form.unitPrice}
                    onChange={e => setForm({ ...form, unitPrice: e.target.value })}
                />

                <input className="border p-2" placeholder="Supplier"
                    value={form.supplierName}
                    onChange={e => setForm({ ...form, supplierName: e.target.value })}
                />

                <input type="date" className="border p-2"
                    value={form.dateReceived}
                    onChange={e => setForm({ ...form, dateReceived: e.target.value })}
                />

                <button className="bg-blue-600 text-white p-2">
                    {editId ? "Update" : "Save"}
                </button>

            </form>

            <table className="w-full border">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p.productCode} className="text-center">

                            <td>{p.productName}</td>
                            <td>{p.category}</td>
                            <td>{p.quantityInStock}</td>
                            <td>{p.unitPrice}</td>

                            <td className="space-x-2">
                                <button onClick={() => edit(p)} className="bg-yellow-500 px-2">
                                    Edit
                                </button>

                                <button onClick={() => remove(p.productCode)} className="bg-red-500 px-2">
                                    Delete
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    )
}

export default Product