import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { BookOpen, LayoutDashboard, Plus, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { UserData } from "../context/UserContext"
import { useEffect } from "react"
import { toast } from "react-toastify"

const Navbar = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const {setIsAuth,isAuth}=UserData();

  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout")
      toast.success("Logged out successfully")
      setIsAuth(false)
      localStorage.removeItem("user")
      navigate("/login")

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if(!isAuth){
        navigate("/login")
    }
  }, [isAuth, navigate])

  return (
    <div className="relative">
      <nav className="bg-[#1E1E1E] text-[#FFFFFF] px-6 py-4 flex items-center justify-between shadow-lg border-b border-[#333333]">
        {/* Left - Logo with icon */}
        <Link
          to="/dashboard"
          className="text-[#E94560] font-bold text-2xl flex items-center gap-2 hover:text-[#FFB400] transition-colors duration-200"
        >
          <BookOpen className="w-8 h-8" />
          <span className="hidden sm:block">MangaVault</span>
        </Link>

        {/* Center - Desktop Navigation Links */}
        <div className="hidden md:flex gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-[#FFB400] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#2A2A2A]"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/mangas"
            className="flex items-center gap-2 hover:text-[#FFB400] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#2A2A2A]"
          >
            <BookOpen className="w-5 h-5" />
            <span>My Mangas</span>
          </Link>
          <Link
            to="/mangas/add"
            className="flex items-center gap-2 hover:text-[#FFB400] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#2A2A2A]"
          >
            <Plus className="w-5 h-5" />
            <span>Add Manga</span>
          </Link>
        </div>

        {/* Right - Desktop Logout Button */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="bg-[#E94560] hover:bg-[#FFB400] text-white hover:text-black px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#FFFFFF] hover:text-[#FFB400] transition-colors duration-200 z-50 relative"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1E1E1E] border-b border-[#333333] md:hidden z-40 shadow-lg">
          <div className="flex flex-col p-4 space-y-2 text-white">
            <Link
              to="/"
              className="flex items-center gap-3 hover:text-[#FFB400] transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-[#2A2A2A]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/mangas"
              className="flex items-center gap-3 hover:text-[#FFB400] transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-[#2A2A2A]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-5 h-5" />
              <span>My Mangas</span>
            </Link>
            <Link
              to="/mangas/add"
              className="flex items-center gap-3 hover:text-[#FFB400] transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-[#2A2A2A]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Plus className="w-5 h-5" />
              <span>Add Manga</span>
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setIsMobileMenuOpen(false)
              }}
              className="bg-[#E94560] hover:bg-[#FFB400] text-white hover:text-black px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 mt-4 w-full justify-start"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar;