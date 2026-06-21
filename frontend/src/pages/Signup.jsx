import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    role: "buyer",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Account Created successfully!");
      navigate("/login");
    } else {
      const data = await res.json();
      console.log(data);
      alert(data.msg || "Account Creation failed!");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={handleChange}
        >
          <option value="buyer">Buyer</option>
          <option value="agent">Agent</option>
        </select>

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Signup
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account? {" "}
          <span onClick={() => navigate('/login')} className="font-bold cursor-pointer">
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;