import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    total_pages: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "latest"
  });

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: pagination.limit.toString()
      }).toString();

      const res = await API.get(`blogs/?${query}`);
      const data = res.data;

      setBlogs(data.blogs || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 9,
        total_pages: data.total_pages || 0
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = () => {
    fetchBlogs(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchBlogs(newPage);
    }
  };



  return (
    <div>
      <div className="bg-[#fdf0f0] min-h-screen px-10 py-10">
        <h1 className="text-2xl font-bold mb-6 ml-12">
          Real Estate News & Blogs
        </h1>

        <div className="flex gap-4 mb-10 ml-12">
          <div className="flex items-center bg-white border-gray-500 shadow-sm rounded-md px-4 py-2 w-1/3">
            <input
              type="text"
              placeholder="Search blogs..."
              className="outline-none w-full text-sm"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <FaSearch className="text-gray-500 cursor-pointer" onClick={handleSearch} />
          </div>

          <select
            className="bg-white border-gray-500 shadow-sm rounded-md px-4 py-2 text-sm w-1/4"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="market">Market Trends</option>
            <option value="tips">Buying Tips</option>
            <option value="news">Real Estate News</option>
          </select>

          <select
            className="bg-white border-gray-500 shadow-sm rounded-md px-4 py-2 text-sm w-1/4"
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          
        </div>

       
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-10">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-10">No blogs found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`http://localhost:8000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-blog.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{blog.description}</p>
                    <button onClick={() => navigate(`/blog/${blog.id}`)} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🔥 Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BlogPage;