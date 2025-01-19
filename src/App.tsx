// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './Chat'
import ProtectedRoutes from './ProtectedRoutes'
import SignIn from './SignIn'

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
