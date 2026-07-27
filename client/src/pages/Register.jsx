import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    adminCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (
      form.accountType === "admin" &&
      !form.adminCode.trim()
    ) {
      alert("Enter the admin registration code");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        accountType: form.accountType,
        adminCode:
          form.accountType === "admin"
            ? form.adminCode.trim()
            : "",
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-950 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-[460px] shadow-xl border border-zinc-800"
      >
        <h1 className="text-4xl text-white font-bold mb-2 text-center">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Register for ShopEase
        </p>

        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
          required
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
          required
        />

        <p className="text-white font-semibold mb-3">
          Account Type
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <label
            className={`text-center cursor-pointer rounded-xl p-3 border transition ${
              form.accountType === "user"
                ? "bg-white text-black border-white"
                : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            <input
              type="radio"
              name="accountType"
              value="user"
              checked={form.accountType === "user"}
              onChange={handleChange}
              className="hidden"
            />

            Customer
          </label>

          <label
            className={`text-center cursor-pointer rounded-xl p-3 border transition ${
              form.accountType === "admin"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-zinc-800 text-white border-zinc-700"
            }`}
          >
            <input
              type="radio"
              name="accountType"
              value="admin"
              checked={form.accountType === "admin"}
              onChange={handleChange}
              className="hidden"
            />

            Admin
          </label>
        </div>

        {form.accountType === "admin" && (
          <div className="mb-6">
            <input
              type="password"
              name="adminCode"
              value={form.adminCode}
              placeholder="Admin Registration Code"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-blue-500 focus:border-blue-300"
              required
            />

            <p className="text-xs text-zinc-400 mt-2">
              Admin registration requires the secret code.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:bg-zinc-500 disabled:text-white transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-gray-400 mt-5 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;