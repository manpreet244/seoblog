import { useState } from "react";
import { forgotPassword } from "../../actions/auth";

const ForgotPasswordComponent = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });

  const { email, message, error, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: "", message: "", [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });

    if (!email) {
      setValues({ ...values, error: "Email is required" });
      return;
    }

    try {
      const data = await forgotPassword(email);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: "",
          showForm: false,
        });
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setValues({
        ...values,
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pb-3">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={handleChange("email")}
          placeholder="Type your email"
          required
        />
      </div>
      <div>
        <button className="btn btn-primary" type="submit">
          Send password reset link
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="container">
        <h2>Forgot Password</h2>
        <hr />
        {showError()}
        {showMessage()}
        {showForm && passwordForgotForm()}
      </div>
    </>
  );
};

export default ForgotPasswordComponent;
