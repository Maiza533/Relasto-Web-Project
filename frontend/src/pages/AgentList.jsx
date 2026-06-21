import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

function AgentList() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    total_pages: 0
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/agents/?search=${search}&page=${page}&sort=${sort}`
      );
      const data = await res.json();
      setAgents(data.agents || []);
      setPagination({
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 8,
        total_pages: data.total_pages || 0
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAgents();
    }, 500); 

    return () => clearTimeout(delay);
  }, [search, page, sort]);

  return (
    <div>
    <div className="bg-orange-50 min-h-screen">

     
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">
          Some Nearby Good Agents
        </h2>

        <div className="flex gap-3">

        
          <input
            type="text"
            placeholder="Search agent..."
            className="flex-1 border rounded-lg px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 rounded-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="top">Top Rated</option>
          </select>

        </div>
      </div>

   
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {agents.map(agent => (
          <div key={agent.id} className="bg-white rounded-xl shadow overflow-hidden">

            <img
              src={agent.image || ''}
              className="h-48 w-full object-cover bg-gray-200"
              alt={agent.name}
              onError={(e) => {
                console.error('Agent image failed to load:', e.target.src);
                e.target.style.display = 'none'; 
              }}
            />

            <div className="p-4 text-center">
              <h3 className="font-semibold">{agent.name}</h3>

              <p className="text-yellow-500 text-sm">
                {"★".repeat(Math.round(agent.rating))}
                {"☆".repeat(5 - Math.round(agent.rating))}
                <span className="text-gray-500 ml-1">
                  {agent.rating}
                </span>
              </p>

              <button
                onClick={() => navigate(`/agent/${agent.id}`)}
                className="mt-3 border px-4 py-1 rounded-lg hover:bg-black hover:text-white"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* 🔥 Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={setPage}
        loading={loading}
      />
    </div>

      <Footer />

    </div>
  );
}

export default AgentList;