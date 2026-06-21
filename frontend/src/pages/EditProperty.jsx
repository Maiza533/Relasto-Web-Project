import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

function EditProperty() {

  const { id } = useParams();
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
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  useEffect(() => {
    console.log("Loading property with id:", id);
    API.get(`property/${id}/`)
      .then(res => {
        console.log("API response:", res);
        console.log("Property data:", res.data.property);
        const data = res.data.property;
        setForm(data);
        setFeatures(data.features || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading property:", err);
        console.error("Error response:", err.response);
        setError("Failed to load property");
        setLoading(false);
      });
  }, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

   
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    
    for (let i = 0; i < videos.length; i++) {
      formData.append("videos", videos[i]);
    }

    const validFeatures = features.filter(f => f.key && f.value);
    formData.append("features", JSON.stringify(validFeatures));

    console.log("Updating property with form:", form);
    console.log("FormData entries:", Array.from(formData.entries()));

    try {
      const response = await API.put(`update-property/${id}/`, formData);
      console.log("Update response:", response);
      alert("Property updated!");
      navigate(`/property/${id}`);

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Update failed");
      alert(`Update failed: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">

      <h2 className="text-2xl font-bold mb-4">Edit Property</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label>Title:</label>
        <input name="title" value={form.title || ""}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Title"
        />

        <label>Description:</label>
        <textarea name="description" value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Price:</label>
        <input name="price" type="number" value={form.price || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Price Per Sqft:</label>
        <input name="price_per_sqft" type="number" value={form.price_per_sqft || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Type:</label>
        <select name="type" value={form.type || "resident"}
          onChange={handleChange} className="w-full border p-2">
          <option value="resident">Resident</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="agriculture">Agriculture</option>
        </select>

        <label>Status:</label>
        <select name="status" value={form.status || "sale"}
          onChange={handleChange} className="w-full border p-2">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>

        <label>Address:</label>
        <input name="address" value={form.address || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>City:</label>
        <input name="city" value={form.city || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Country:</label>
        <input name="country" value={form.country || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>No. of Bedrooms:</label>
        <input name="bedrooms" type="number" value={form.bedrooms || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>No. of Bathrooms:</label>
        <input name="bathrooms" type="number" value={form.bathrooms || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Area:</label>
        <input name="area" type="number" value={form.area || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Year Built:</label>
        <input name="year_built" type="number" value={form.year_built || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <label>Parking:</label>
        <select name="parking" value={form.parking || "yes"}
          onChange={handleChange} className="w-full border p-2">
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unknown">Don't know</option>
        </select>

        <label>Outdoor:</label>
        <input name="outdoor" value={form.outdoor || ""}
          onChange={handleChange}
          className="w-full border p-2"
        />

       
        <label>Images:</label>
        <input type="file" multiple accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full border p-2"
        />

       
        <label>Videos:</label>
        <input type="file" multiple accept="video/*"
          onChange={(e) => setVideos(e.target.files)}
          className="w-full border p-2"
        />


        <button className="w-full bg-black text-white py-2 rounded">
          Update Property
        </button>

      </form>
    </div>
  );
}

export default EditProperty;