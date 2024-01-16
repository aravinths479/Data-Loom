import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button className="btn btn-primary" disabled={isLoading}>
        {isLoading && (
          <>
            <span role="status">Logging you in...</span>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          </>
        )}

        {!isLoading && (
          <>
            <span role="status">Login</span>
          </>
        )}
      </button>
      <br /><br />
      <center>
      Don't have a account, Click here to 
      <Link className="navbar-brand" to="/signup">
        <span style={{ color: "red" }}>
          {" "}
          <strong>signup</strong>{" "}
        </span>
      </Link>
      
      </center>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;
