import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000";

function Profile() {
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({});
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  

  const fetchProfile = async () => {
    try {
      const res = await API.get("profile/");
      const profileData = res.data.user || res.data;
      setProfile(profileData);
      setUser(profileData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
  if (tab === "requests") {
    API.get("user-visit-requests/")
      .then(res => setRequests(res.data))
      .catch(err => console.log(err));
  }
}, [tab]);

 const isOwner = true;

  const handleImageUpload = async (file, type) => {
    const data = new FormData();
    data.append(type, file);

    try {
      await API.put("profile/update/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Updated successfully");
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };


  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      handleImageUpload(e.target.files[0], "image");
    }
  };

  const handleBannerImageChange = (e) => {
    if (e.target.files[0]) {
      handleImageUpload(e.target.files[0], "banner");
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
    <div className="bg-orange-50 min-h-screen">


      <div
        className="h-64 bg-gray-200 relative"
        style={{
          backgroundImage: profile.banner
            ? `url(${BASE_URL}${profile.banner})`
            : "undefined",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwner && (
          <label className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full cursor-pointer">
            📷
            <input
              type="file"
              hidden
              onChange={handleBannerImageChange}
            />
          </label>
        )}
      </div>


      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow flex justify-between items-center -mt-16 relative z-10">

        <div className="flex gap-4 items-center">

          <div className="relative">
            <img
              src={
                profile.image
                  ? `${BASE_URL}${profile.image}`
                  : "https://via.placeholder.com/150"
              }
              className="w-24 h-24 rounded object-cover border-4 border-white bg-gray-200 shadow"
              alt="profile"
            />

            {isOwner && (
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                📷
                <input
                  type="file"
                  hidden
                  onChange={handleProfileImageChange}
                />
              </label>
            )}
          </div>


          <div>
            <h2 className="text-xl font-semibold">
              {profile.name}
            </h2>


            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-2">
                <FaPhoneAlt />
                {profile.phone || "N/A"}
              </p>

              <p className="flex items-center gap-2">
                <FaEnvelope />
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        
          <button
            onClick={() => navigate("/edit-buyer-profile")}
            className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaEdit /> Edit
          </button>
        
      </div>

    
      <div className="max-w-6xl mx-auto mt-10 flex gap-3">
        {[
          { key: "profile", label: "Profile" },
          { key: "preferences", label: "Preferences" },
          { key: "about", label: "About" },
          { key: "reviews", label: "Reviews" },
          { key: "requests", label: "My Requests" }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2 rounded-lg border ${
              tab === t.key
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>


      {tab === "profile" && (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-6 rounded shadow">
          <p><b>Phone:</b> {profile.phone || "N/A"}</p>
          <p><b>City:</b> {profile.city || "N/A"}</p>
        </div>
      )}

      {tab === "preferences" && (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-6 rounded shadow">
          <p><b>Purpose:</b> {profile.purpose || "N/A"}</p>
          <p>
            <b>Budget:</b>{" "}
            ${profile.budget_min || 0} - ${profile.budget_max || 0}
          </p>
        </div>
      )}

      {tab === "about" && (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-6 rounded shadow">
          <p className="text-gray-600">
            {profile.about || "No information provided."}
          </p>
        </div>
      )}

      {tab === "reviews" && (
        <div className="max-w-5xl mx-auto bg-white p-6 mt-6 rounded shadow">
          <p>No reviews yet</p>
        </div>
      )}

      {tab === "requests" && (
  <div className="max-w-6xl mx-auto mt-6 space-y-4">

    <h2 className="text-xl font-semibold">My Visit Requests</h2>

    {requests.length === 0 ? (
      <p>No requests yet</p>
    ) : (
      requests.map(req => (
        <div key={req.id} className="bg-white p-4 rounded-xl shadow flex gap-4">

          <img
            src={
              req.property?.images?.[0]?.image
                ? `http://127.0.0.1:8000${req.property.images[0].image}`
                : "/placeholder.jpg"
            }
            className="w-32 h-24 object-cover rounded"
          />

          <div className="flex-1">

            <h3 className="font-semibold">
              {req.property?.title}
            </h3>

            <p className="text-sm text-gray-500">
              ${req.property?.price}
            </p>

            <p className="mt-2 text-sm">
              <b>Agent:</b> {req.agent?.name}
            </p>

            <p className="text-sm">{req.agent?.phone}</p>
            <p className="text-sm">{req.agent?.email}</p>

            
            <p className="mt-1 text-sm">
              Status:{" "}
              <b className={
                req.status === "approved"
                  ? "text-green-600"
                  : req.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }>
                {req.status}
              </b>
            </p>

            
            {req.visit_time ? (
              <p className="text-purple-600 text-sm">
                Visit Time: {req.visit_time}
              </p>
            ) : (
              req.status === "approved" && (
                <p className="text-gray-500 text-sm">
                  Waiting for agent to set time...
                </p>
              )
            )}

            
            <button
              onClick={() => navigate(`/property/${req.property.id}`)}
              className="mt-3 bg-black text-white px-3 py-1 rounded"
            >
              View Property
            </button>

          </div>
        </div>
      ))
    )}

  </div>
)}

    </div>
  );
}

export default Profile;