// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatHomePage from './pages/ChatHomePage'
import SignInPage from './pages/SignInPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignInPage />} />
        <Route path="/chat" element={<ChatHomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
