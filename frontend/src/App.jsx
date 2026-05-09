import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//Components and pages
import Signup from './pages/Signup'
import Login from './pages/Login'
import Chat from './components/Chat'
import Components from './components/Components'
import CreateConversation from './components/CreateConversation'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  return (
    <BrowserRouter>
      <Routes>
        {
          !token ? (
            <>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </>
          ) : (
            <Route
              path='/create-conversation'
              element={<CreateConversation />}
            />
          )
        }
      </Routes>
    </BrowserRouter>
  )
}