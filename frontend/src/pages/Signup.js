import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

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
            <span role="status">Registering account. Please wait ...</span>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          </>
        )}

        {!isLoading && (
          <>
            <span role="status">Signup</span>
          </>
        )}
      </button>
      {error && <div className="error">{error}</div>}
      <br />
      <br />
      <center>
        Already have a account, Click here to
        <Link className="navbar-brand" to="/login">
          <span style={{ color: "red" }}>
            {" "}
            <strong>Login</strong>{" "}
          </span>
        </Link>
      </center>
    </form>
  );
};

export default Signup;
