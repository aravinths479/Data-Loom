import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Storage from "./components/Storage";
import SharedWithMe from "./components/SharedWithMe";
import RecycleBin from "./pages/RecycleBin";
import NotFound from './components/NotFound';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <br />
        {user && <Storage />}
        <br />

        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/shared-with-me"
              element={user ? <SharedWithMe /> : <Navigate to="/login" />}
            />
            <Route
              path="/recycle-bin"
              element={user ? <RecycleBin /> : <Navigate to="/login" />}
            />

            <Route  element={<NotFound />} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
