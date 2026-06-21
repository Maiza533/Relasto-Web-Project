import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import API from "../api/api";
import { FaEdit, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";

function AgentProfile() {
  const BASE_URL = "http://127.0.0.1:8000";
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState({});
  const [rent, setRent] = useState([]);
  const [sale, setSale] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [visitTimes, setVisitTimes] = useState({});
  const [tab, setTab] = useState("rent");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const User = localStorage.getItem("user") || sessionStorage.getItem("user");
    setUser(User ? JSON.parse(User) : null);
  }, []);

  useEffect(() => {
    API.get(`agent/${id}/`)
      .then((res) => {
        console.log("Agent data received:", res.data);
        console.log("Agent image URL:", res.data.agent.image);
        console.log("Agent banner URL:", res.data.agent.banner);
        console.log("Rent properties:", res.data.rent_properties);
        console.log("Sale properties:", res.data.sale_properties);
        setAgent(res.data.agent);
        setRent(res.data.rent_properties || []);
        setSale(res.data.sale_properties || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching agent profile:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    API.get(`visit-requests/?agent_id=${id}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const approveRequest = async (id) => {
    await API.patch(`visit-request/${id}/approve/`);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
  };

  const rejectRequest = async (id) => {
    await API.patch(`visit-request/${id}/reject/`);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  };

  const handleTimeChange = (id, value) => {
    setVisitTimes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const setTime = async (id) => {
    const time = visitTimes[id];

    if (!time) {
      alert("Select time first");
      return;
    }

    await API.patch(`visit-request/${id}/set-time/`, {
      visit_time: time,
    });

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, visit_time: time } : r)),
    );
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`agent/${id}/reviews/`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  const isOwner = user?.id === agent?.id;

  const handleDelete = async (pid) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await API.delete(`properties/?id=${pid}`);
        setRent((prev) => prev.filter((p) => p.id !== pid));
        setSale((prev) => prev.filter((p) => p.id !== pid));
        alert("Property deleted successfully");
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property");
      }
    }
  };

  const handleImageUpload = async (file, type) => {
    const data = new FormData();
    data.append(type, file);

    try {
      console.log(`Uploading ${type}...`);
      const uploadResponse = await API.put("edit-profile/", data);
      console.log("Upload response:", uploadResponse);

      console.log("Refreshing agent data...");
      const res = await fetch(`http://127.0.0.1:8000/api/agent/${id}/`);
      const updatedData = await res.json();
      console.log("Updated agent data:", updatedData);

      setAgent(updatedData.agent);
      alert(`${type === "image" ? "Profile" : "Cover"} photo updated!`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Failed to update ${type === "image" ? "profile" : "cover"} photo: ${error.message}`,
      );
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, "image");
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file, "banner");
    }
  };

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
          🔒 Please Login to View Agent Profile
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
      <div className="bg-orange-50 min-h-screen">
        <div
          className="h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: agent.banner
              ? `url(${BASE_URL}${agent.banner})`
              : undefined,
            backgroundColor: agent.banner ? undefined : "#f9fafb",
          }}
        >
          {agent.banner && (
            <img
              src={agent.banner}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Banner image failed to load:", e.target.src);
              }}
              style={{ display: "none" }}
            />
          )}
          {isOwner && (
            <label className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full cursor-pointer hover:bg-black/70 transition">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="max-w-6xl mx-auto bg-orange-50 p-6 rounded-xl shadow flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <img
                //src={agent.image ? `${BASE_URL}${agent.image}` : ''}
                src={`${BASE_URL}${agent.image}`}
                className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                alt="Profile"
                onError={(e) => {
                  console.error("Profile image failed to load:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
              {isOwner && (
                <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className=" flex ml-12 justify-center">
              <h2 className="text-xl font-semibold">{agent.name}</h2>

              <div className="text-yellow-500 text-sm">
                {"★".repeat(Math.round(agent.rating || 0))}
              </div>
              <div className="ml-60 flex flex-col justify-center gap-2">
                <p className="text-black text-lg flex items-center gap-2">
                  <FaPhoneAlt />
                  <span>{agent.phone}</span>
                </p>
                <p className="text-black text-lg flex items-center gap-2">
                  <FaEnvelope />
                  <span>{agent.email}</span>
                </p>
              </div>
            </div>
          </div>

          {!isOwner && (
            <button
              onClick={() => navigate("/contact")}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Contact
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              <FaEdit />
            </button>
          )}
        </div>

        <div className="flex justify-between items-center max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold">Properties</h2>

          {isOwner && (
            <button
              onClick={() => navigate("/add-property")}
              className="bg-black text-white px-5 py-2 rounded-lg"
            >
              Add new Property
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto mt-6 flex gap-3">
          {[
            { key: "rent", label: "For Rent" },
            { key: "sale", label: "For Sale" },
            { key: "about", label: "About" },
            { key: "reviews", label: "Review" },
            { key: "requests", label: "Visit Requests" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2 rounded-lg border transition ${
                tab === t.key
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(tab === "rent" || tab === "sale") && (
          <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {(tab === "rent" ? rent : sale).map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <img
                  src={p.images && p.images.length > 0 ? p.images[0].image : ""}
                  alt={p.title}
                  onError={(e) => {
                    console.error(
                      "Property image failed to load:",
                      e.target.src,
                    );
                    e.target.style.display = "none"; // Hide broken image
                  }}
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    📍 {p.address}, {p.city}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    {p.type} • {p.status}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      className="bg-black text-white px-3 py-1 rounded"
                    >
                      View Details
                    </button>
                    <p className="font-semibold">${p.price}</p>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => navigate(`/edit-property/${p.id}`)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "about" && (
          <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">{agent.bio}</p>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <b>Experience:</b> {agent.experience}
              </p>
              <p>
                <b>Property Types:</b> House, Apartment
              </p>
              <p>
                <b>Address:</b> {agent.address}
              </p>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="max-w-6xl mx-auto mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Clients Review</h2>
            </div>

            {!isOwner && (
              <ReviewForm
                agentId={id}
                onReviewAdded={async () => {
                  const res = await API.get(`agent/${id}/reviews/`);
                  setReviews(res.data);
                }}
              />
            )}

            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}

        {tab === "requests" && (
          <div className="max-w-6xl mx-auto mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Visit Requests</h2>

            {requests.length === 0 ? (
              <p>No visit requests yet</p>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 rounded-xl shadow flex gap-4"
                >
                  
                  <img
                    src={
                      req.property?.images?.[0]?.image
                        ? `http://127.0.0.1:8000${req.property.images[0].image}`
                        : "/placeholder.jpg"
                    }
                    className="w-32 h-24 object-cover rounded"
                  />

                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{req.property?.title}</h3>
                    <p className="text-sm text-gray-500">
                      ${req.property?.price}
                    </p>

                    <p className="mt-2 text-sm">
                      <b>Client:</b> {req.name}
                    </p>
                    <p className="text-sm">{req.email}</p>
                    <p className="text-sm">{req.phone}</p>

                    <p className="text-sm text-gray-600 mt-1">
                      Message: {req.message}
                    </p>

                    <p className="text-sm text-blue-600">
                      Preferred Date: {req.preferred_date}
                    </p>

                    <p className="text-sm mt-1">
                      Status: <b>{req.status}</b>
                    </p>

                    {req.status === "pending" && (
                      <div className="mt-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="datetime-local"
                            className="border px-2 py-1 rounded w-56"
                            onChange={(e) =>
                              handleTimeChange(req.id, e.target.value)
                            }
                          />

                          <button
                            onClick={() => setTime(req.id)}
                            className="bg-black text-white px-4 py-1 rounded hover:bg-green-800 transition"
                          >
                            Set Time
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => approveRequest(req.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectRequest(req.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="h-16"></div>
      </div>

      <Footer />
    </div>
  );
}

export default AgentProfile;
