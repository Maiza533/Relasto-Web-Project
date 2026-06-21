import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    total_pages: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    price_min: "",
    price_max: "",
  });

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: pagination.limit.toString()
      }).toString();
      
      const res = await API.get(`properties/?${query}`);
      const data = res.data;
      
      setProperties(data.properties || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 6,
        total_pages: data.total_pages || 0
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = () => {
    fetchProperties(1); 
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchProperties(newPage);
    }
  };


  return (
    <div>
    <div className="bg-[#f5f2ee] min-h-screen p-8">

    
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Find Property</h2>

        <div className="flex flex-wrap gap-3 items-center">
          
        
          <input
            placeholder="Enter your address"
            className="px-4 py-2 rounded-lg border w-[250px]"
            onChange={(e)=>setFilters({...filters, search:e.target.value})}
          />

          
          <select
            className="px-4 py-2 rounded-lg border"
            onChange={(e)=>setFilters({...filters, status:e.target.value})}
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          
          <input
            placeholder="$15000 - $18000"
            className="px-4 py-2 rounded-lg border"
            onChange={(e)=>setFilters({...filters, price_min:e.target.value})}
          />

          <select
            className="px-4 py-2 rounded-lg border"
            onChange={(e)=>setFilters({...filters, type:e.target.value})}
          >
            <option value="">Bed - 3</option>
            <option value="resident">Resident</option>
            <option value="commercial">Commercial</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-black text-white px-5 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          
        </div>

        
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {properties.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={p.images && p.images.length > 0 ? p.images[0].image : ""}
              className="w-full h-48 object-cover bg-gray-200"
              onError={(e) => {
                console.error('Property image failed to load:', e.target.src);
                e.target.style.display = 'none'; 
              }}
            />

           
            <div className="p-4">
              <p className="text-gray-500 text-sm">
                📍 {p.address}, {p.city}
              </p>

              <div className="flex justify-between text-sm mt-2">
                <span>🛏 {p.bedrooms || 1} Bed Room</span>
                <span>🛁 {p.bathrooms || 1} Bath</span>
              </div>

              <div className="flex justify-between text-sm mt-1">
                <span>📐 {p.area || 1032} sqft</span>
                <span>🏡 Family</span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button onClick={() => navigate(`/property/${p.id}`)} className="bg-black text-white px-4 py-2 rounded">
                  View Details
                </button>

                <span className="font-bold text-lg">
                  ${p.price}
                </span>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
    <Footer />
    </div>
  );
}

