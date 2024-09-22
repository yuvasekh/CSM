import { Route, Routes, Navigate } from "react-router-dom";
// import Login from "./login.jsx";
import Home from "./home.jsx";
function AppRouter() {
  return (
    <div className="router h-full w-full ">
      <Routes>
        {/* <Route path="*" element={<Navigate replace to="/login" />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
