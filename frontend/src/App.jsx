import { BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import AddProperty from "./pages/AddProperty";
import Properties from "./pages/ListingPage";
import AgentProfile from "./pages/AgentProfile";
import AgentList from "./pages/AgentList";
import EditProfile from "./pages/EditProfile";
import Profile from "./pages/Profile";
import PropertyDetail from "./pages/PropertyDetail";
import EditProperty from "./pages/EditProperty";
import EditBuyerProfile from "./pages/EditBuyerProfile";
import BlogDetailPage from "./pages/BlogDetailPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/agent/:id" element={<AgentProfile />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path="/agents" element={<AgentList />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-buyer-profile" element={<EditBuyerProfile />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        
      
      </Routes>
    </Router>
  );
}

export default App;