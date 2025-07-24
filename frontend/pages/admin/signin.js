import { useState } from "react";
import Router from "next/router";
import { signinAdmin, authenticate, isAuth } from "../../actions/auth";

const AdminSignin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
  });

  const { email, password, error, loading } = values;

  if (isAuth() && isAuth().role === 1) {
    if (typeof window !== "undefined") Router.replace("/admin");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: "" });

    try {
      const data = await signinAdmin({ email, password });
      authenticate(data, () => Router.push("/admin"));
    } catch (err) {
      setValues({
        ...values,
        loading: false,
        error: err.response?.data?.error || "Signin failed",
      });
    }
  };

  const handleChange = (field) => (e) =>
    setValues({ ...values, error: "", [field]: e.target.value });

  return (
    <div className="container p-4" style={{ maxWidth: "420px" }}>
      <h2 className="mb-3 text-center">Admin Sign In</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Admin Email"
            value={email}
            onChange={handleChange("email")}
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handleChange("password")}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminSignin;
