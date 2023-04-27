import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './components/App'
import './css/index.css'
import Chat from './components/Chat'
import ErrorPage from './components/ErrorPage'
import Login from './components/Login'
import Guftgu from './components/Guftgu'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/',
        element: <Chat/>,
        errorElement: <ErrorPage/>
      },
      {
        path: '/guftgu',
        element: <Guftgu/>,
        errorElement: <ErrorPage/>
      },
      {
        path: '/login',
        element: <Login/>,
        errorElement: <ErrorPage/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)