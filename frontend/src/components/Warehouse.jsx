import { useEffect, useState } from "react"
import axios from "axios"

function Warehouse() {

    const token = localStorage.getItem("token")

    const [data, setData] = useState([])

    const [form, setForm] = useState({
        warehouseName: "",
        warehouseLocation: ""
    })

    const [editId, setEditId] = useState(null)

    const load = async () => {
        const res = await axios.get("http://localhost:5000/warehouses", {
            headers: { Authorization: `Bearer ${token}` }
        })
        setData(res.data)
    }

    useEffect(() => {
        load()
    }, [])

    const submit = async (e) => {
        e.preventDefault()

        if (editId) {
            await axios.put(`http://localhost:5000/warehouses/${editId}`, form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } else {
            await axios.post("http://localhost:5000/warehouses", form, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }

        setForm({ warehouseName: "", warehouseLocation: "" })
        setEditId(null)
        load()
    }

    const edit = (w) => {
        setForm(w)
        setEditId(w.warehouseCode)
    }

    const remove = async (id) => {
        await axios.delete(`http://localhost:5000/warehouses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        load()
    }

    return (

        <div>

            <form onSubmit={submit} className="flex gap-2 mb-4">

                <input className="border p-2"
                    placeholder="Name"
                    value={form.warehouseName}
                    onChange={e => setForm({ ...form, warehouseName: e.target.value })}
                />

                <input className="border p-2"
                    placeholder="Location"
                    value={form.warehouseLocation}
                    onChange={e => setForm({ ...form, warehouseLocation: e.target.value })}
                />

                <button className="bg-blue-600 text-white px-4">
                    {editId ? "Update" : "Save"}
                </button>

            </form>

            <table className="w-full border">

                <tbody>
                    {data.map(w => (
                        <tr key={w.warehouseCode} className="text-center">

                            <td>{w.warehouseName}</td>
                            <td>{w.warehouseLocation}</td>

                            <td>
                                <button onClick={() => edit(w)} className="bg-yellow-500 px-2">
                                    Edit
                                </button>

                                <button onClick={() => remove(w.warehouseCode)} className="bg-red-500 px-2">
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

export default Warehouse