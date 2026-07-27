import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful");

      if (data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-[420px] shadow-xl"
      >
        <h1 className="text-4xl text-white font-bold mb-8 text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-zinc-800 text-white outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Login
        </button>

        <p className="text-gray-400 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-white">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;