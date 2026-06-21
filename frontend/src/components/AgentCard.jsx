import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";
 function AgentCard({ agent }) {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col gap-4 bg-white p-6 rounded-xl shadow'>
      <h1 className="font-semibold ">Agent Information</h1>
    <div className="bg-white p-4 rounded-xl flex gap-4 items-center">
      <img
          src={
            agent.image
              ? `${BASE_URL}${agent.image}`
              : "https://via.placeholder.com/100"
          }
          className="w-16 h-16 rounded object-cover"
          alt="agent"
        />

      <div className="ml-10">
        
        <h3 className="font-semibold">{agent.name}</h3>
        <div className="text-yellow-500">
          {"★".repeat(Math.round(agent.rating || 4))}
        </div>
        <p className="text-sm text-gray-500">✉ {agent.email}</p>
        <p className="text-sm text-gray-500">📞 {agent.phone}</p>
      </div>
      <div className="flex ml-35 justify-end">
    <button onClick={() => navigate("/contact")} className='bg-black text-white px-5 py-2 rounded-lg'>
      Contact
    </button>
      </div>
    </div>
    
    </div>
  );
}

export default AgentCard;