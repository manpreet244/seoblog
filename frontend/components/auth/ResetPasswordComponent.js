import { useState } from "react";
import { resetPassword } from "../../actions/auth";
import { useRouter } from "next/router";

const ResetPasswordComponent = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const { name, newPassword, confirmPassword, error, message, showForm } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: "", message: "" });

    // Validation
    if (!name || !newPassword || !confirmPassword) {
      setValues({ ...values, error: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setValues({ ...values, error: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setValues({ ...values, error: "Password must be at least 6 characters long" });
      return;
    }

    const resetPasswordToken = router.query.id;

    console.log('=== Frontend Reset Debug ===');
    console.log('Name:', name);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    console.log('Reset Token:', resetPasswordToken);
    console.log('===============================');

    try {
      const data = await resetPassword({
        newPassword,
        resetPasswordLink: resetPasswordToken,
      });

      console.log('Reset response:', data);

      if (data.error) {
        setValues({ ...values, error: data.error, showForm: false });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          name: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.error || err.message || "Something went wrong";
      setValues({
        ...values,
        error: errorMessage,
      });
    }
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: "", message: "", [name]: e.target.value });
  };

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pb-3">
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group pb-3">
        <input
          type="password"
          className="form-control"
          onChange={handleChange("newPassword")}
          value={newPassword}
          placeholder="Type new password"
          required
        />
      </div>
      <div className="form-group pb-3">
        <input
          type="password"
          className="form-control"
          onChange={handleChange("confirmPassword")}
          value={confirmPassword}
          placeholder="Confirm new password"
          required
        />
      </div>
      <div>
        <button className="btn btn-primary" type="submit">
          Change password
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="container">
        <h2>Reset Password</h2>
        <hr />
        {showError()}
        {showMessage()}
        {showForm && passwordResetForm()}
      </div>
    </>
  );
};

export default ResetPasswordComponent;
