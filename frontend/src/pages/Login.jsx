import React, { useState, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);

 /* const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };*/

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const userData = { id: data.user_id, role: data.role, email };


      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access");
      sessionStorage.removeItem("refresh");
      sessionStorage.removeItem("user");

      

      if (remember) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("access", data.access);
        sessionStorage.setItem("refresh", data.refresh);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
      

      alert("Login successful!");

      setTimeout(() => {
        if (data.role === "agent") navigate(`/agent/${data.user_id}`, { replace: true });
        else if (data.role === "buyer") navigate(`/profile`, { replace: true });
        else navigate("/", { replace: true });
      }, 100);

    } catch (err) {
      alert(err.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseLogin = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
      <div className="bg-white w-[380px] rounded-xl p-6 shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Log in</h2>
          <button 
            onClick={handleCloseLogin}
            className="text-black-500 hover:text-gray font-bold cursor-pointer"
          >
            <FaTimesCircle />
          </button>
        </div>

        <input
          type='text'
          placeholder="Username / Email"
          className='w-full border rounded-lg px-3 py-2 mb-3'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type='password'
          placeholder="Password"
          className='w-full border rounded-lg px-3 py-2 mb-3'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-between items-center text-sm mb-3">
          <label className="flex items-center gap-1 font-bold">
            <input
              type="checkbox"
              onChange={() => setRemember(!remember)}
              disabled={loading}
            />
            Remember me
          </label>

          {/*<span
            onClick={() => navigate("/forgot-password")}
            className='font-bold cursor-pointer hover:underline'
          >
            Forgot Password
          </span>*/}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

       {/* <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border mt-3 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login with Google
        </button>*/}

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate('/signup')}
            className="font-bold cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
