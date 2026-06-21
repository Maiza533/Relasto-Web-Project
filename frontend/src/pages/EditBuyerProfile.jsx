import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function EditBuyerProfile() {
  const [form, setForm] = useState({
    phone: "",
    city: "",
    budget_min: "",
    budget_max: "",
    purpose: "",
    about: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("profile/");
        const data = res.data?.user || res.data;
        setForm({
          phone: data.phone || "",
          city: data.city || "",
          budget_min: data.budget_min || "",
          budget_max: data.budget_max || "",
          purpose: data.purpose || "",
          about: data.about || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const data = new FormData();
    data.append("phone", form.phone);
    data.append("city", form.city);
    data.append("budget_min", form.budget_min? Number(form.budget_min) : null);
    data.append("budget_max", form.budget_max? Number(form.budget_max) : null);
    data.append("purpose", form.purpose);
    data.append("about", form.about);
    try {
      await API.put("profile/update/",  data,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
      alert("Profile Updated!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Update failed!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <label>Phone No:</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />

          <label>About:</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="About"
            className="border p-2 rounded"
          />

          <label>City:</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
          />

          <label>Min Budget:</label>
          <input
            name="budget_min"
            type="number"
            value={form.budget_min}
            onChange={handleChange}
            placeholder="Min Budget"
            className="border p-2 rounded"
          />

          <label>Max Budget:</label>
          <input
            name="budget_max"
            type="number"
            value={form.budget_max}
            onChange={handleChange}
            placeholder="Max Budget"
            className="border p-2 rounded"
          />

          <label>Purpose:</label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Purpose</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>

          
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditBuyerProfile;