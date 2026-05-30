import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

function Login() {

    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()

        setError("")

        try {

            const res = await axios.post("http://localhost:5000/login", form)

            console.log(res.data)

            if (!res.data.token) {
                setError("Invalid login details")
                return
            }

            localStorage.setItem("token", res.data.token)

            navigate("/dashboard")

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Server error"
            )
        }
    }

    return (

        <div className="flex justify-center items-center h-screen bg-gray-100">

            <form onSubmit={login} className="bg-white p-6 shadow w-96 rounded">

                <h2 className="text-xl font-bold mb-4 text-center">
                    Login
                </h2>

                {error && (
                    <div className="bg-red-500 text-white p-2 mb-2">
                        {error}
                    </div>
                )}

                <input
                    className="border p-2 mb-2 w-full"
                    placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />

                <input
                    type="password"
                    className="border p-2 mb-4 w-full"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button className="bg-blue-600 text-white w-full p-2 mb-3">
                    Login
                </button>

                {/* 👇 REGISTER LINK */}
                <p className="text-center text-sm">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-bold">
                        Register here
                    </Link>
                </p>

            </form>

        </div>
    )
}

export default Login