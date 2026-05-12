import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {

    try {

      const response = await API.post('/login', formData);

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert(response.data.message);

      navigate('/dashboard');

    } catch (error) {

      alert(error.response.data.message);

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[380px]">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-700">
            Livestock AI
          </h1>

          <p className="text-gray-500 mt-2">
            Disease Monitoring System
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold"
          >
            Login
          </button>

        </div>

        <p className="text-center mt-5 text-gray-500">

          Don't have an account?

          <Link
            to="/signup"
            className="text-green-700 font-semibold ml-1"
          >
            Signup
          </Link>

        </p>

      </div>

    </div>
  );
}