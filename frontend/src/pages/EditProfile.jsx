import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [form, setForm] = useState({
    phone: "",
    bio: "",
    experience: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("phone", form.phone);
    data.append("bio", form.bio);
    data.append("experience", form.experience);
    data.append("address", form.address);

    await API.put("edit-profile/", data);

    alert("Profile Updated!");

    if (!user?.id) {
      alert("Unable to determine user. Please login again.");
      navigate("/");
      return;
    }

    navigate(`/agent/${user.id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">

      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <label>Phone:</label>
        <input
          value={form.phone}
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-2"
        />

        <label>Experience:</label>
        <input
          value={form.experience}
          placeholder="Experience"
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="w-full border p-2"
        />

        <label>Bio:</label>
        <textarea
          value={form.bio}
          placeholder="Bio"
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full border p-2"
        />

        <label>Address:</label>

        <input
          value={form.address}
          placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border p-2"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;