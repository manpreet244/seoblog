import { useState } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "miss@gmail.com",
    password: "missuuu",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: "", loading: true });

    try {
      const data = await signin({ email, password });

      authenticate(data, () => {
        if (isAuth() && isAuth().role === 1) {
          Router.push("/admin");
        } else {
          Router.push("/user");
        }
      });
    } catch (err) {
      setValues({
        ...values,
        error: err.response?.data?.error || "Signin failed",
        loading: false,
        showForm: true,
      });
    }
  };

  const handleChange = (field) => (e) => {
    setValues({ ...values, error: "", [field]: e.target.value });
  };

  const showFeedback = () => (
    <>
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success text-center" role="alert">
          {message}
        </div>
      )}
    </>
  );

  const signinForm = () => (
<div className="d-flex justify-content-center " style={{ marginTop:"50px" ,inHeight: "100vh" }}>      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "16px",
          border: "1px solid #ddd",
          backgroundColor: "#fff"
        }}
      >
        <h3 className="text-center mb-1" style={{ color: "#c634eb", fontWeight: "700" }}>Sign in</h3>
        <p className="text-center text-muted mb-4">Access your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="signinEmail"
              placeholder="Email"
              value={email}
              onChange={handleChange("email")}
              required
            />
            <label htmlFor="signinEmail">Email</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="signinPassword"
              placeholder="Password"
              value={password}
              onChange={handleChange("password")}
              required
            />
            <label htmlFor="signinPassword">Password</label>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#c634eb",
              borderColor: "#c634eb",
              color: "#fff",
              fontWeight: "500"
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container">
      {showFeedback()}
      {showForm && signinForm()}
    </div>
  );
};

export default SigninComponent;
