import { useState } from "react";
import API from "../api/api";

function ReviewForm({ agentId, onReviewAdded }) {
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("agentId:", agentId);
  console.log("rating:", form.rating);
  console.log("comment:", form.comment);

    try {
      await API.post("add-review/", {
        agent: agentId,
        rating: form.rating,
        comment: form.comment,
      });

      setForm({ rating: 5, comment: "" });
      onReviewAdded();

    } catch (err) {
      alert("Error submitting review");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Write Review</h3>
      <form onSubmit={handleSubmit}>

      <select name="rating" value={form.rating} onChange={handleChange}>
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>
      

      <textarea
        name="comment"
        value={form.comment}
        onChange={handleChange}
        placeholder="Write comment..."
        className="w-full border p-2 mt-2"
      />

      <button className="bg-black text-white px-4 py-2 mt-2">
        Submit
      </button>
      </form>
    </div>
  );
}

export default ReviewForm;