import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import OtpVerify from "./pages/OtpVerify";


const App = () => {
  const { loading, isAuth, user} = UserData(); 
  console.log(isAuth);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          
          
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />          
            
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify/:token" element={isAuth ? <Home /> : <OtpVerify />} />
            <Route
              path="/register"
              element={ <Register />}
            />
            <Route
              path="/forgot"
              element={!isAuth ? <Forgot /> : <Home />} 
            />
            <Route
              path="/reset-password/:token"
              element={<Reset />}
            />
            

            
           
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;