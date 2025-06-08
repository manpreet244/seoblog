import { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";

// ✅ Main Signup Component
const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (isAuth()) Router.push("/");
  }, []);

  // 📤 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: "" });

    try {
      const data = await signup({ name, email, password });
      setValues({
        ...values,
        name: "",
        email: "",
        password: "",
        loading: false,
        message: data.message || "Signup successful",
        showForm: false,
      });
    } catch (err) {
      setValues({
        ...values,
        loading: false,
        error: err.response?.data?.error || "Signup failed",
      });
    }
  };

  // 📥 
  //  handler
  const handleChange = (field) => (e) => {
    setValues({ ...values, error: "", [field]: e.target.value });
  };

  // 🔄 Feedback elements
  const showLoading = () =>
    loading && (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  const showError = () =>
    error && (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );

  const showMessage = () =>
    message && (
      <div className="alert alert-success text-center" role="alert">
        {message}
      </div>
    );

  // 📝 Signup form layout
  const signupForm = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
        <h3 className="text-center mb-1">Sign up</h3>
        <p className="text-center text-muted mb-4">Sign up to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Name"
              value={name}
              onChange={handleChange("name")}
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleChange("email")}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleChange("password")}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container">
      {showLoading()}
      {showError()}
      {showMessage()}
      {showForm && signupForm()}
    </div>
  );
};

export default SignupComponent;
