import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import img_image from "../assets/images/img_image.png";
import Navbar from "../components/Navbar";
import taylor from "../assets/images/taylor.jfif";
import { FaSearchLocation, FaHome, FaRegSmile } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";
import { FaDollarSign, FaFire, FaSmile } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import photo1 from "../assets/images/photo1.jfif";
import photo2 from "../assets/images/photo2.jfif";
import photo3 from "../assets/images/photo3.jfif";
import photo4 from "../assets/images/photo4.jfif";
import photo5 from "../assets/images/photo5.jfif";

function LandingPage() {
  const [properties, setProperties] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [active, setActive] = useState('resident');
  const [type, setType] = useState('resident');
  

  const tabs = [
    {key: 'resident', label: 'Resident Property'},
    {key: 'commercial', label: 'Commercial Property'},
    {key: 'industrial', label: 'Industrial Property'},
    {key: 'agriculture', label: 'Agriculture Property'},
  ];

  const handleClick = (tab) => {
    setActive(tab.key);
    setType(tab.key); 
  };


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`properties/?type=${type}`);
        const data = response.data || {};
        const propertiesData = data.properties || data.results || data;
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [type]);


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get('blogs/');
        const blogsData = response.data.results || response.data || [];
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    
    fetchBlogs();
  }, []);

  
  if (loading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="#f5f5f5">
        <section className="max-w-8lg mx-auto flex flex-col md:flex-row items-center py-16 px-6 bg-orange-50">
          <div className="flex-1 ml-12">
            <h1 className="text-4xl font-bold text-black-800 mb-6">
              Find a perfect property <br /> Where you'll love to live
            </h1>

            <p className="text-black-500 mb-6">
              We helps businesses customize, automate and scale up their ad
              <br />
              production and delivery.
            </p>

            <div className="bg-white p-5 rounded-xl shadow w-[500px]">
              <div className="flex gap-6 mb-4">
                <button className="bg-black text-white px-14 py-3 rounded">
                  Buy
                </button>
                <button className="bg-gray-200 px-14 py-3 rounded">Sell</button>
                <button className="bg-gray-200 px-14 py-3 rounded">Rent</button>
              </div>

              <input
                className="w-full border p-2 mb-3 rounded"
                placeholder="City/Street"
              />
              <input
                className="w-full border p-2 mb-3 rounded"
                placeholder="Property Type"
              />
              <input
                className="w-full border p-2 mb-3 rounded"
                placeholder="Price Range"
              />

              <button className="w-full bg-black text-white py-2 rounded">
                Search
              </button>
            </div>
          </div>

          <div className="flex-1">
            <img src={img_image} className="w-full" alt="Property" />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          <div className="bg-orange-200 p-10 rounded-2xl md:col-span-1 justify-center h-[350px] w-[500px]">
            <h1 className="text-3xl font-bold mb-4 mt-6">
              Simple & easy way to find your dream Appointment
            </h1>
            <p className="text-md mb-10">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-xl">
              Get Started
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 col-span-2 p-2 ml-30">
            <div className="bg-orange-100 p-4 rounded-2xl text-3xl font-bold">
              <FaSearchLocation className="text-orange-500 mb-2 text-xl" />
              <p className="font-bold">
                Search <br /> your location
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl text-3xl font-bold">
              <FaHome className="text-orange-500 mb-2 text-xl" />
              <p className="font-bold">Visit Appointment</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl text-3xl font-bold">
              <FaRegSmile className="text-orange-500 mb-2 text-xl" />
              <p className="font-bold">Get your dream house</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl text-3xl font-bold">
              <MdOutlineEventAvailable className="text-orange-500 mb-2 text-xl" />
              <p className="font-bold">Enjoy your Appointment</p>
            </div>
          </div>
        </section>

        <section className="bg-[#f1ebe7] py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <div>
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full shadow mb-4">
                <FaDollarSign className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-3xl font-bold">$15.4M</h2>
              <p className="text-gray-500 mt-2 text-md">
                Owned from <br /> Properties transactions
              </p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full shadow mb-4">
                <HiOutlineUserGroup className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-3xl font-bold">25K+</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Properties for Buy & sell <br /> Successfully
              </p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full shadow mb-4">
                <FaFire className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-3xl font-bold">500</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Daily completed <br /> transactions
              </p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full shadow mb-4">
                <FaSmile className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-3xl font-bold">600+</h2>
              <p className="text-gray-500 mt-2 text-sm">Regular Clients</p>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 ml-18">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold mb-6 mt-10">
              Featured Properties
            </h2>
          </div>

          <div className="flex gap-50 border-gray-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(tab);
                }}
                className={`pb-3 text-xl font-medium transition relative
                  ${
                    active === tab.key
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }
                `}
              >
                {tab.label}

                {active === tab.key && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black"></span>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-7xl mx-auto">
            {loading && properties.length === 0 ? (
              <div className="text-center py-10">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No properties found for {type} type
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? property.images[0].image
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      className="w-full h-48 object-cover bg-gray-200"
                      alt={property.title || "Property"}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      }}
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {property.title || "Untitled"}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        📍 {property.address || "Address not available"},{" "}
                        {property.city || ""}
                      </p>
                      <p className="text-gray-500 text-sm mb-3">
                        {property.type || "N/A"} • {property.status || "N/A"}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl">
                          $
                          {property.price
                            ? property.price.toLocaleString()
                            : "0"}
                        </span>
                        <button
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="bg-black text-white px-4 py-2 rounded"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#f1ebe7] py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Simple & easy way to find your dream Appointment
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. In a free hour, when our power of choice is
                untrammelled and when nothing prevents our being able to do what
                we like best, every pleasure is to be welcomed.
              </p>
              <button onClick={() => navigate('/properties')} className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
                Get Started
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={photo1}
                className="rounded-xl h-48 w-full object-cover"
                alt="Property 1"
              />
              <img
                src={photo2}
                className="rounded-xl h-48 w-full object-cover"
                alt="Property 2"
              />
              <img
                src={photo3}
                className="rounded-xl h-48 w-full object-cover"
                alt="Property 3"
              />
              <img
                src={photo4}
                className="rounded-xl h-48 w-full object-cover"
                alt="Property 4"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -bottom-5 -left-5 w-full h-full bg-orange-500 rounded-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
                className="relative rounded-2xl w-full h-[400px] object-cover"
                alt="Modern House"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Best rated host on popular rental sites
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. In a free hour, when our power of choice is
                untrammelled.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  ✓ Find excellent deals
                </li>
                <li className="flex items-center gap-2">
                  ✓ Friendly host & Fast support
                </li>
                <li className="flex items-center gap-2">
                  ✓ Secure payment system
                </li>
              </ul>
              
            </div>
          </div>
        </section>

        <section className="bg-[#f1ebe7] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-10 grid md:grid-cols-2 gap-6 items-center">
              <img
                src={taylor}
                className="rounded-2xl w-full max-w-[400px] h-[400px] object-cover ml-15"
                alt="Taylor Wilson"
              />
              <div>
                <h3 className="text-2xl font-bold mb-2">Taylor Wilson</h3>
                <p className="text-black-500 mb-4">
                  Product Manager - Static Mania
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 mr-10">
                  Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis
                  proin sodales. Turpis viverra diam porttitor mattis morbi ac
                  amet. Euismod commodo. We get you customer relationships that
                  last. Curabitur non nulla sit amet nisl tempus convallis quis
                  ac lectus. Vivamus suscipit tortor eget felis porttitor
                  volutpat. Nulla quis lorem ut libero malesuada feugiat. Proin
                  eget tortor risus. Pellentesque in ipsum id orci porta
                  dapibus. Sed porttitor lectus nibh, eget tincidunt nibh
                  pulvinar a. Cras ultricies ligula sed magna dictum porta.
                  Praesent sapien massa, convallis a pellentesque nec, egestas
                  non nisi.
                </p>
              </div>
            </div>
          </div>
        </section>

        

        <Footer />
      </div>
    </>
  );
}

export default LandingPage;

