import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import Footer from "../components/Footer";

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`blog/${id}/`);
        setBlog(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
    <div className="bg-orange-50 max-w-4xl mx-auto p-6">
      <img src={`http://localhost:8000${blog.image}`} className="w-full h-80 object-cover mb-4" />
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700">{blog.description}</p>
    </div>
    <Footer />
    </div>
  );
}

export default BlogDetailPage;