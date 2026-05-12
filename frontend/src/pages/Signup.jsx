import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {

    try {

      const response = await API.post('/signup', formData);

      alert(response.data.message);

      navigate('/');

    } catch (error) {

      alert(error.response.data.message);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[380px]">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-green-700">
            Create Account
          </h1>

        </div>

        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-green-600 text-white p-3 rounded-xl"
          >
            Signup
          </button>

        </div>

        <p className="text-center mt-5 text-gray-500">
          Already have an account?

          <Link
            to="/"
            className="text-green-700 font-semibold ml-1"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}