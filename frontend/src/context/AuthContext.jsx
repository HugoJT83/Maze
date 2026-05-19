import React, { createContext, useContext, useEffect, useState } from 'react'
import { removeUser, setUser, UserSlicePath } from '../redux/slice/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { axiosClient } from '../utils/axiosClient'
import LoaderComponent from '../components/ui/LoaderComponent'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext({
  user: null,
  fetchUserProfile: () => { },
  logoutUser: () => { },
})

export const useAuthContext = () => useContext(AuthContext)

/**
 * Obtiene los datos guardados en localStorage si los hubiera
 */
export const AuthContextProvider = ({ children }) => {


  const user = useSelector(UserSlicePath)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUserProfile = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true)

      const token = localStorage.getItem("token") || ""

      if (!token) return
      const response = await axiosClient.get("/auth/profile", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      const data = await response.data

      console.log(data);
      if (data && data.auth_method === "google" && data.avatar) {
        localStorage.setItem("google_profile_pic", data.avatar)
      }
      dispatch(setUser(data))

    } catch (error) {
      toast.error(error.response?.data?.detail || error.message)
    } finally {
      if (isInitialLoad) setLoading(false)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        await fetchUserProfile(true)
      }
      else {
        setLoading(false)
      }
    }
    initializeAuth()
  }, [])

  /**
   * For Logout USer
   */
  const logoutUser = () => {
    localStorage.removeItem("token")
    dispatch(removeUser())
    toast.success("Sesión cerrada correctamente")
    navigate("/")
  }

  if (loading) {
    return <div className='h-screen flex items-center justify-center'>
      <LoaderComponent></LoaderComponent>
    </div>
  }
  return (
    <AuthContext.Provider
      value={{ user, logoutUser, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
