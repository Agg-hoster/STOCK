import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

function Register() {

    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phone: "",
        username: "",
        password: ""
    })

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const register = async (e) => {
        e.preventDefault()

        setError("")
        setMessage("")

        try {

            const res = await axios.post("http://localhost:5000/register", form)

            if (res.data.success) {

                setMessage("Registered successfully")

                setTimeout(() => {
                    navigate("/")
                }, 1000)

            } else {
                setError(res.data.message)
            }

        } catch (err) {
            setError(err.response?.data?.message || "Server error")
        }
    }

    return (

        <div className="flex justify-center items-center h-screen bg-gray-100">

            <form onSubmit={register} className="bg-white p-6 shadow w-96 rounded">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Register
                </h2>

                {message && (
                    <div className="bg-green-500 text-white p-2 mb-2">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500 text-white p-2 mb-2">
                        {error}
                    </div>
                )}

                <input className="border p-2 mb-2 w-full" placeholder="Full Name"
                    onChange={e => setForm({ ...form, fullname: e.target.value })}
                />

                <input className="border p-2 mb-2 w-full" placeholder="Email"
                    onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <input className="border p-2 mb-2 w-full" placeholder="Phone"
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                />

                <input className="border p-2 mb-2 w-full" placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />

                <input type="password" className="border p-2 mb-4 w-full" placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button className="bg-blue-600 text-white w-full p-2 mb-3">
                    Register
                </button>

                {/* 👇 LOGIN LINK */}
                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 font-bold">
                        Login
                    </Link>
                </p>

            </form>

        </div>
    )
}

export default Register