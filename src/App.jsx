import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FormPage, ListPage, LoginPage, HomePage } from '@/pages'
import './App.css'
import { useState } from 'react'
import Router from '@/router'

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
