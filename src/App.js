import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom"

import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Picture from "./pages/Picture"
import SinglePic from "./pages/SinglePic"
import Article from "./pages/Article"
import SingleArt from "./pages/SingleArt"
import Back from "./pages/Back"

import "./style.scss"
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/pic",
        element: <Picture />
      },
      {
        path: "/singlepic/:uuid",
        element: <SinglePic />
      },
      {
        path: "/article",
        element: <Article />
      },
      {
        path: "/singleart/:user_uuid/:id",
        element: <SingleArt />
      },
    ]
  },
  {
    path: "/register",
    element: <Register />//
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/back",
    element: <Back />
  },
])

function App () {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </div>
  )
}

export default App
