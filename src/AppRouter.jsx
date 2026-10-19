// AppRouter.jsx
import { Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Carte from './Carte.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/carte" element={<Carte />} />
    </Routes>
  )
}

export default AppRouter