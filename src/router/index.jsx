import { Routes, Route, Navigate, useRoutes } from 'react-router-dom'
import Layout from '@/layout'
import { FormPage, ListPage, LoginPage, HomePage, HospitalPage, Registration, UserPage, PatientPage } from '@/pages'

function Router() {
  return useRoutes([{
    path: '/', element: <Layout />,
    children: [
      { path: '', index: true, element: <Navigate to='/home' /> },
      { path: 'home', element: <HomePage /> },
      { path: 'hospital/:hoscode', element: <HospitalPage /> },
      // { path: 'user', element: <UserPage /> },
      { path: 'patient/index', element: <PatientPage /> },
    ]
  },
    // { path: '*', element: <Navigate to="/login" replace /> }
  ])
}

export default Router