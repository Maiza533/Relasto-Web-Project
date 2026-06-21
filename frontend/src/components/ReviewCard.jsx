import React from "react";

function ReviewCard({ review }) {
  return (
    <div className="border p-3 rounded bg-gray-50 shadow-sm">

      
      <p className="font-semibold text-gray-800">
        {review.reviewer_name}
      </p>

    
      <p className="text-yellow-500">
        {"⭐".repeat(review.rating)}
      </p>

      
      <p className="text-gray-700 mt-1">
        {review.comment}
      </p>

     
      <small className="text-gray-400">
        {new Date(review.created_at).toLocaleDateString()}
      </small>

    </div>
  );
}

export default ReviewCard;