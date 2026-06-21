import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";

import AgentCard from "../components/AgentCard";
import ReviewCard from "../components/ReviewCard";
import MapComponent from "../components/MapComponent";
import ReviewForm from "../components/ReviewForm";
import Footer from "../components/Footer";

function PropertyDetail() {
  const { id } = useParams();

  const [data, setData] = useState({});
  const [tab, setTab] = useState("map");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  function todayDate() {
    return new Date().toISOString().split("T")[0];
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: todayDate(),
    message: "",
  });

  const handleSubmit = async () => {
    try {
      await API.post(`visit-request/${property.id}/`, {
        ...form,
        agent: agent.id,
        property: property.id,
      });

      alert("Visit request sent!");
    } catch (err) {
      console.log(err);
      alert("Error sending request");
    }
  };

  useEffect(() => {
    const User = localStorage.getItem("user") || sessionStorage.getItem("user");

    setUser(User ? JSON.parse(User) : null);
  }, []);

  useEffect(() => {
    API.get(`property/${id}/`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const { property = {}, agent = {}, images = [] } = data;
  const imageList = images.length > 0 ? images : property.images || [];
  const videoList =
    data.videos?.length > 0 ? data.videos : property.videos || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">
          🔒 Please Login to View Property Detail.
        </h1>

        <p className="text-gray-600 mt-2">
          You must be logged in to access this page.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-black text-white px-6 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-orange-50 min-h-screen pb-10">
        <div className="max-w-6xl mx-auto pt-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imageList.length > 0 ? (
              imageList.map((img, i) => (
                <img
                  key={i}
                  src={img.image || img}
                  className="h-48 w-full object-cover rounded"
                  alt={`Property image ${i + 1}`}
                />
              ))
            ) : (
              <div className="col-span-3 h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                No images available
              </div>
            )}
          </div>
          <div className="mt-6">
            {property.videos?.map((vid, i) => (
              <video key={i} controls className="w-full mb-4">
                <source src={vid.video} />
              </video>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold">{property.title}</h2>

                <p className="text-gray-500 mt-1">{property.address}</p>

                <div className="flex gap-4 mt-4">
                  <div className="border px-4 py-2 rounded">
                    ${property.price}
                  </div>
                  <div className="border px-4 py-2 rounded">
                    ${property.price}/month
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{property.description}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-4">Local Information</h3>

                <div className="flex gap-2 mb-4">
                  {["map", "schools", "crime", "shop"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1 rounded ${
                        tab === t ? "bg-black text-white" : "bg-gray-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                  {tab === "map" ? (
                    <MapComponent
                      address={property.address}
                      city={property.city}
                      country={property.country}
                    />
                  ) : tab === "schools" ? (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Nearby Schools
                      </h3>
                      <p>School information will be displayed here</p>
                      <ul className="mt-4 space-y-2">
                        <li>School A - 2.5 km</li>
                        <li>School B - 3.1 km</li>
                        <li>School C - 4.2 km</li>
                      </ul>
                    </div>
                  ) : tab === "crime" ? (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Crime Statistics
                      </h3>
                      <p>Safety information for this area</p>
                      <div className="mt-4">
                        <div className="bg-green-100 p-2 rounded mb-2">
                          Low crime rate in this neighborhood
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on local police reports
                        </div>
                      </div>
                    </div>
                  ) : tab === "shop" ? (
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Nearby Shopping
                      </h3>
                      <p>Shopping centers and markets</p>
                      <ul className="mt-4 space-y-2">
                        <li>Mall A - 1.2 km</li>
                        <li>Market B - 2.8 km</li>
                        <li>Supermarket C - 3.5 km</li>
                      </ul>
                    </div>
                  ) : (
                    <span>{tab.toUpperCase()} VIEW</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-4">Home Highlights</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>Parking: {property.parking || "No info"}</p>
                  <p>Outdoor: {property.outdoor || "No info"}</p>
                  <p>Price/Sqft: {property.price_per_sqft || "N/A"}</p>
                  <p>Year Built: {property.year_built || "N/A"}</p>
                  <p>HOA: None</p>
                </div>
              </div>

              <AgentCard agent={agent} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow h-fit">
              <h3 className="font-semibold mb-4">Request for Visit</h3>
              <input
                placeholder="Full Name"
                className="w-full border p-2 mb-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Email"
                className="w-full border p-2 mb-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Phone"
                className="w-full border p-2 mb-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                type="date"
                className="w-full border p-2 mb-2"
                value={form.preferred_date}
                onChange={(e) =>
                  setForm({ ...form, preferred_date: e.target.value })
                }
              />

              <textarea
                placeholder="Message"
                className="w-full border p-2 mb-2"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-2 rounded"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PropertyDetail;
