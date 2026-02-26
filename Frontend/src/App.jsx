import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Donor from "./pages/Donor/Donor";
import Hospital from "./pages/Hospital/Hospital";
import NGO from "./pages/NgoPartners/NgoPartners";
import Login from "./pages/Login/Login";
import Awareness from "./pages/Awareness/Awareness";
import Recipient from "./pages/Recipient/Recipient";
import DonorForm from "./pages/DonorForm/DonorForm";
import Register from "./pages/Register/Register";
import DonorDetails from "./pages/DonorDetails/DonorDetails";
import UserSelection from "./pages/UserSelection/UserSelection";

function Layout() {
  const location = useLocation();

  // Hide footer only on Login page
  const hideFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipient" element={<Recipient />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/ngos" element={<NGO />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/donorform" element={<DonorForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor-details/:id" element={<DonorDetails />} />
        <Route path="/user-selection" element={<UserSelection />} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
