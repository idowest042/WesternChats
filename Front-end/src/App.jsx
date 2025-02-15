import Navbar from "./components/Navbar"
import {Routes, Route} from "react-router-dom"
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./Store/UseAuthStore"; // Ensure lowercase "useAuthStore"
import { useEffect } from "react";
import {Loader} from "lucide-react"
import { Navigate } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import { useThemeStore } from "./Store/useThemeStore";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);
    if (isCheckingAuth && !authUser)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      );
  return (
  <div data-theme={theme}>
    <Navbar/>
<Routes>
  <Route path="/" element={authUser ? <Homepage/> : <Navigate to="/login"/>}/>
  <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/>}/>
  <Route path="/login" element={!authUser ? <Login/> : <Navigate to='/'/>}/>
  <Route path="/settings" element={ <Settings/>}/>
  <Route path="/Profile" element={authUser ? <Profile/>: <Navigate to="/login"/>}/>
</Routes>
<Toaster/>
  </div> );
}
 
export default App;