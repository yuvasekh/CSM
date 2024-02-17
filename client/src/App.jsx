import { useState } from 'react'
import Home from "./components/home.jsx";
import './App.css'
import UserDashboard from './components/userDashboard.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Home/> */}
      <UserDashboard/>
    </>
  )
}

export default App
