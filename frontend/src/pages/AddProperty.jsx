import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function AddProperty() {

  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "resident",
    status: "sale",
    address: "",
    city: "",
    country: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    year_built: "",
    parking: "",
    outdoor: "",
    price_per_sqft: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [features, setFeatures] = useState([{ key: "", value: "" }]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }


  for (let i = 0; i < videos.length; i++) {
    formData.append("videos", videos[i]);
  }


    const validFeatures = features.filter(f => f.key && f.value);
    formData.append("features", JSON.stringify(validFeatures));

    try {
      await API.post("create-property/", formData);
      alert("Property added successfully!");
      navigate(`/agent/${user.id}`);
    } catch (err) {
      alert("Error adding property");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">

      <h2 className="text-2xl mb-4 font-bold">Add Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>Title:</label>
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2" />

        <label>Description:</label>
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />

        <label>Price:</label>
        <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full border p-2" />
        <label>Price_Per_Sqrt:</label>
        <input name="price_per_sqft" type="number" placeholder="Price per sqft" onChange={handleChange} className="w-full border p-2" />

        <label>Type:</label>
        <select name="type" onChange={handleChange} className="w-full border p-2">
          <option value="resident">Resident</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="agriculture">Agriculture</option>
        </select>

        <label>Status:</label>
        <select name="status" onChange={handleChange} className="w-full border p-2">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>

        <label>Address:</label>
        <input name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2" />
        <label>City:</label>
        <input name="city" placeholder="City" onChange={handleChange} className="w-full border p-2" />
        <label>Country:</label>
        <input name="country" placeholder="Country" onChange={handleChange} className="w-full border p-2" />

        <label>No. of Bedrooms:</label>
        <input name="bedrooms" placeholder="Bedrooms" onChange={handleChange} className="w-full border p-2" />
        <label>No. of Bathrooms:</label>
        <input name="bathrooms" placeholder="Bathrooms" onChange={handleChange} className="w-full border p-2" />
        <label>Area:</label>
        <input name="area" placeholder="Area" onChange={handleChange} className="w-full border p-2" />
        <label>Year Built:</label>
        <input name="year_built" placeholder="Year Built" onChange={handleChange} className="w-full border p-2" />

        <label>Parking:</label>
        <select name="parking" onChange={handleChange} className="w-full border p-2">
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unknown">Don't know</option>
        </select>

        <label>Outdoor:</label>
        <input name="outdoor" placeholder="Outdoor" onChange={handleChange} className="w-full border p-2" />

      
        <label>Images:</label>
        <input type="file" multiple accept="image/*" onChange={(e)=>setImages(Array.from(e.target.files))} className="w-full border p-2" />
        {images.length > 0 && (
          <p className="text-sm text-gray-500">Selected {images.length} image(s)</p>
        )}
        <label>Videos:</label>
        <input type="file" multiple accept="video/*" onChange={(e)=>setVideos(Array.from(e.target.files))} className="w-full border p-2" />
        {videos.length > 0 && (
          <p className="text-sm text-gray-500">Selected {videos.length} video(s)</p>
        )}


        <button className="w-full bg-black text-white py-2">
          Submit
        </button>

      </form>
    </div>
  );
}

export default AddProperty;