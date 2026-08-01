import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Contests from './pages/Contests.jsx'
import ContestDetails from './pages/ContestDetails.jsx'
import CreateContest from './pages/CreateContest.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Chat from './pages/Chat.jsx'
import CodeEditor from './pages/CodeEditor.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Signup from './pages/Signup.jsx'
import Subscription from './pages/Subscription.jsx'
import Profile from './pages/Profile.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Wallet from './pages/Wallet.jsx'
import AdminPayments from './pages/AdminPayments.jsx'
import More from './pages/More.jsx'
import Settings from './pages/Settings.jsx'
import Developers from './pages/Developers.jsx'
import NotFound from './pages/NotFound.jsx'
import { getStoredTheme, applyTheme } from './utils/theme.js'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => getStoredTheme() === 'dark')
  const location = useLocation()
  const isEditorPage = location.pathname.startsWith('/editor')
  const isChatPage = location.pathname.startsWith('/chat')

  useEffect(() => {
    applyTheme(darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/create" element={<CreateContest />} />
          <Route path="/contests/:id" element={<ContestDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/editor/:id" element={<CodeEditor />} />
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/:username" element={<UserProfile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/more" element={<More />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isEditorPage && !isChatPage && <Footer />}
    </div>
  )
}
