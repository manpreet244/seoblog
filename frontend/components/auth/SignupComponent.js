import { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
import Router from "next/router";

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

  useEffect(() => {
    if (isAuth()) Router.push("/");
  }, []);

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

      // Redirect to signin after short delay
      setTimeout(() => Router.push("/signin"), 1500);
    } catch (err) {
      setValues({
        ...values,
        loading: false,
        error: err.response?.data?.error || "Signup failed",
      });
    }
  };

  const handleChange = (field) => (e) => {
    setValues({ ...values, error: "", [field]: e.target.value });
  };

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

  const signupForm = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div
        className="card p-3 shadow-lg border-0"
        style={{
          maxWidth: "350px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(198,52,235,0.08)",
          background: "#fff",
        }}
      >
        <h3 className="text-center mb-2" style={{ color: "#c634eb", fontWeight: 700, fontSize: "2rem" }}>
          Sign up
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Name"
              value={name}
              onChange={handleChange("name")}
              required
              style={{ fontSize: "1rem", borderRadius: "8px" }}
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleChange("email")}
              required
              style={{ fontSize: "1rem", borderRadius: "8px" }}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handleChange("password")}
              required
              style={{ fontSize: "1rem", borderRadius: "8px" }}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#c634eb",
              borderColor: "#c634eb",
              color: "#fff",
              fontWeight: "500",
              borderRadius: "8px",
              fontSize: "1.1rem",
              padding: "8px 0"
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
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
