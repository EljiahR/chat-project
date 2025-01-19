// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import ProtectedRoutes from './_components/ProtectedRoutes'
import SignIn from './pages/SignIn'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignIn />} />
        <Route path="/" element={<ProtectedRoutes component={<Chat />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
