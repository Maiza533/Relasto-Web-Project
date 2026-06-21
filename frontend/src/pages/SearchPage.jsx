import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/api";

function SearchPage() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");

    if (query) {
      API.get(`search/?q=${query}`)
        .then(res => setData(res.data))
        .catch(err => console.log(err));
    }
  }, [location.search]);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Search Results</h2>

      {data.length === 0 ? (
        <p>No results found</p>
      ) : (
        data.map(item => (
          <div key={item.id} className="border p-3 mb-2">
            {item.title || item.name}
          </div>
        ))
      )}
    </div>
  );
}

export default SearchPage;