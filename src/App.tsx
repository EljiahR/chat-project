// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatHome from './pages/ChatHome'
import ProtectedRoutes from './_components/ProtectedRoute'
import SignIn from './pages/SignIn'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path="/chat" element={<ProtectedRoutes component={ChatHome} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
