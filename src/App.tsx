// import Chat from './Chat'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatHomePage from './pages/ChatHomePage'
import SignInPage from './pages/SignInPage'
import LoadingScreen from './_components/Generics/LoadingScreen'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoadingScreen />} />
        <Route path="/chat" element={<ChatHomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
