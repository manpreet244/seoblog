import { useState , useEffect, use } from "react";
import { signin ,authenticate , isAuth} from "../../actions/auth";
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
//   useEffect(()=>{
//     isAuth() && Router.push('/')
//   },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: "", loading: true });
    try {
      const data = await signin({  email, password });
      //save user token to cookie
      //save user info to localstorge
      //authenticate user
      authenticate(data, ()=>
        Router.push('/')
    )
    } catch (err) {
        console.log(err)
      setValues({
        ...values,
        error: err.response?.data?.error,
        loading: false,
        showForm: true,
      });
    }
  };

  const handleChange = (fieldName) => (e) => {
    setValues({ ...values, error: "", [fieldName]: e.target.value });
  };

  const showLoading = () =>
    loading && (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  const showError = () =>
    error && (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  const showMessage = () =>
    message && (
      <div className="alert alert-success" role="alert">
        {message}
      </div>
    );

  const signinForm = () => (
    <div
      className=" d-flex justify-content-center  flex-column 
align-items-center "  style={{ minHeight: "600px" }}
    >
      <div
        className="w-100  rounded-4 d-flex my-form h-100
        align-items-between flex-column justify-content-center gap-5"
        style={{ maxWidth: "350px", minHeight: "400px", padding: "20px" }}
      > 
      <h4 className="text-white text-center"> SIGN IN</h4>
        <form onSubmit={handleSubmit}>p
         
          <div className="form-group mb-3">
            <input
              value={email}
              onChange={handleChange("email")}
              type="email"
              className="form-control  border-0"
              placeholder="Type your email"
              required
          
            />
          </div>
          <div className="form-group mb-3">
            <input
              value={password}
              onChange={handleChange("password")}
              type="password"
              className="form-control  border-0"
              placeholder="Type your password"
              required
            />
          </div>
          <div>
            <button className="btn btn-light w-50 " disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      {showLoading()}
      {showError()}
      {showMessage()}

      {showForm && signinForm()}
    </div>
  );
};

export default SigninComponent;
