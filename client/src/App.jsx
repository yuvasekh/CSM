import { useState } from 'react'
import Home from "./components/home.jsx";
import './App.css'
import UserDashboard from './components/userDashboard.jsx';
import AppRouter from './components/router.jsx';
import { BrowserRouter } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Home/> */}
      {/* <UserDashboard/> */}
      
      <BrowserRouter>
      <AppRouter/>
  </BrowserRouter>

    </>
  )
}

export default App
