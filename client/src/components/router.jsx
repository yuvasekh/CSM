import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./login.jsx";
import Home from "./home.jsx";
function AppRouter() {
  return (
    <div className="router h-full w-full overflow-hidden">
      <Routes>
        <Route path="*" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
