// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './Chat'
import ProtectedRoutes from './ProtectedRoutes'
import Login from './Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path="/" element={<ProtectedRoutes component={<Chat />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
