import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBook, FaHeart, FaBell, FaTimes } from 'react-icons/fa'
import { LogIn } from 'lucide-react'
import {UserData} from "../context/UserContext"
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formError, setFormError] = useState("")
    const [showLoginModal, setShowLoginModal] = useState(false)
    const { loginUser, btnLoading, setBtnLoading } = UserData();
    const navigate=useNavigate();
   
    useEffect(() => {
    }, [])
    
    
const submitHandler = (e) => {
        e.preventDefault()
        
        if (!email.trim() || !password.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
       
        if (rememberMe) {
            localStorage.setItem('proimg_email', email)
        } else {
            localStorage.removeItem('proimg_email')
        }
        
        setFormError("")
        loginUser(email, password, navigate)
    }
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    }
    
    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    }

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const features = [
        {
            icon: <FaBook className="text-3xl text-[#E94560]" />,
            title: "Discover Trending Manga",
            description: "Explore the latest and most popular manga series from around the world"
        },
        {
            icon: <FaHeart className="text-3xl text-[#FFB400]" />,
            title: "Track Your Favorites",
            description: "Keep track of your reading progress and create personalized reading lists"
        },
        {
            icon: <FaBell className="text-3xl text-[#E94560]" />,
            title: "Stay Updated",
            description: "Get notified about new releases and updates from your favorite series"
        }
    ]
    
    return (
        <div className='min-h-screen bg-[#121212] overflow-x-hidden'>
            {/* Hero Section */}
            <motion.div 
                className='min-h-screen flex flex-col items-center justify-center px-4 text-center relative'
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E94560] via-transparent to-[#FFB400]"></div>
                </div>

                <motion.div className="relative z-10 max-w-4xl mx-auto" variants={itemVariants}>
                    <motion.h1 
                        className='text-6xl md:text-8xl font-bold mb-6 text-[#FFFFFF]'
                        variants={itemVariants}
                    >
                        <span className="text-[#E94560]">Manga</span>
                        <span className="text-[#FFB400]">Vault</span>
                    </motion.h1>
                    
                    <motion.p 
                        className='text-xl md:text-2xl text-[#B3B3B3] mb-8 max-w-2xl mx-auto leading-relaxed'
                        variants={itemVariants}
                    >
                        Your ultimate destination to discover trending manga, track your favorites, 
                        and stay updated with new releases from the world of manga
                    </motion.p>
                    
                    <motion.div 
                        className='flex flex-col sm:flex-row gap-4 justify-center mb-12'
                        variants={itemVariants}
                    >
                        <motion.button
                            onClick={() => setShowLoginModal(true)}
                            className='px-8 py-4 bg-[#E94560] hover:bg-[#d63851] text-[#FFFFFF] text-lg font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                        
                        <motion.button
                            onClick={() => setShowLoginModal(true)}
                            className='px-8 py-4 border-2 border-[#FFB400] text-[#FFB400] hover:bg-[#FFB400] hover:text-[#121212] text-lg font-semibold rounded-lg transition-all duration-300'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Login
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16"
                    variants={itemVariants}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-700 hover:border-[#E94560] transition-all duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                        >
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-[#FFFFFF] mb-3 text-center">
                                {feature.title}
                            </h3>
                            <p className="text-[#B3B3B3] text-center leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    variants={itemVariants}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-[#E94560] rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-[#E94560] rounded-full mt-2"></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div 
                            className='p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm bg-opacity-95 bg-[#1E1E1E] border border-gray-700 relative'
                            variants={modalVariants}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors duration-200"
                            >
                                <FaTimes size={20} />
                            </button>

                            <motion.h2 className='text-xl font-semibold text-center mb-2 text-[#E94560]' variants={itemVariants}>
                                MangaVault
                            </motion.h2>
                            
                            <motion.h2 className='text-2xl font-bold text-[#FFFFFF] text-center mb-6' variants={itemVariants}>
                                Welcome Back
                            </motion.h2>
                            
                            {formError && (
                                <motion.div 
                                    className='mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm'
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {formError}
                                </motion.div>
                            )}
                            
                            <div onSubmit={submitHandler}>
                                <motion.div className='mb-4' variants={itemVariants}>
                                    <label htmlFor="email" className='block text-sm font-medium text-[#B3B3B3] mb-1'>
                                        EMAIL
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <FaEnvelope className='text-gray-500' />
                                        </div>
                                        <input 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                            type="email" 
                                            id='email' 
                                            className='w-full py-2 pl-10 pr-3 border border-gray-600 bg-[#121212] rounded-md text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' 
                                            placeholder='Enter your email'
                                        />
                                    </div>
                                </motion.div>
                                
                                <motion.div className='mb-6' variants={itemVariants}>
                                    <label htmlFor="password" className='block text-sm font-medium text-[#B3B3B3] mb-1'>
                                        PASSWORD
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <FaLock className='text-gray-500' />
                                        </div>
                                        <input 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                            type={showPassword ? "text" : "password"} 
                                            id='password' 
                                            className='w-full py-2 pl-10 pr-10 border border-gray-600 bg-[#121212] rounded-md text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent' 
                                            placeholder='Enter your password'
                                        />
                                        <div 
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 
                                                <FaEyeSlash className='text-gray-500 hover:text-gray-300' /> : 
                                                <FaEye className='text-gray-500 hover:text-gray-300' />
                                            }
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <motion.div className='flex items-center justify-between mb-6' variants={itemVariants}>
                                    <div className='flex items-center'>
                                        <input 
                                            type="checkbox" 
                                            id="remember" 
                                            className='h-4 w-4 text-[#E94560] focus:ring-[#E94560] border-gray-600 bg-[#121212] rounded'
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                        />
                                        <label htmlFor="remember" className='ml-2 block text-sm text-[#B3B3B3]'>
                                            Remember me
                                        </label>
                                    </div>
                                    <div>
                                        <a href="forgot" className='text-sm font-medium text-[#E94560] hover:underline'>
                                            Forgot password?
                                        </a>
                                    </div>
                                </motion.div>
                                
                                <motion.button 
                                    onClick={submitHandler}
                                    className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#FFFFFF] bg-[#E94560] hover:bg-[#d63851] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E94560] transition-colors duration-200 flex items-center justify-center'
                                    disabled={btnLoading}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {btnLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Loading...
                                        </div>
                                    ) : (
                                        "SIGN IN"
                                    )}
                                </motion.button>
                            </div>
                            
                            <motion.div className='mt-6 text-center' variants={itemVariants}>
                                <div className='relative mb-4'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <div className='w-full border-t border-gray-600'></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className='px-2 bg-[#1E1E1E] text-gray-400'>or</span>
                                    </div>
                                </div>
                               
                                <div className='text-[#B3B3B3]'>
                                    Don't have an account?{' '}
                                    <a href="register" className='font-medium text-[#E94560] hover:underline'>
                                        Create an account
                                    </a>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Login



