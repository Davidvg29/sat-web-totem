import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Inmueble from "./pages/Inmueble"
import Novedades from './pages/Novedades'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/inmueble" element={<Inmueble/>}/>
      <Route path='/novedades' element={<Novedades/>}/>
    </Routes>
  )
}

export default App