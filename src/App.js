import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Login";
import RegisterPage from "./Register";
import ForgotPassword from "./ForgotPassword";
import HomePage from "./Home";
import Report from "./Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
