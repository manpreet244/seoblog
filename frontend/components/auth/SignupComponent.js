import { useState } from "react";

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted");
};

const handleChange = (e) => {
  console.log(e.target.value);
};
const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: "",
    message: "",
    showForm: true,
  });
  return <>{signupForm()}</>;
};
const signupForm = () => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          onChange={handleChange}
          type="text"
          className="form-control"
          placeholder="Type your name"
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange}
          type="email"
          className="form-control"
          placeholder="Type your email"
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange}
          type="password"
          className="form-control"
          placeholder="Type your password"
        />
      </div>
      <div>
        <button className="btn btn-primary">Sign up</button>
      </div>
    </form>
  );
};

export default SignupComponent;
