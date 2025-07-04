import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Inmueble from "./pages/Inmueble"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/inmueble" element={<Inmueble/>}/>
    </Routes>
  )
}

export default App