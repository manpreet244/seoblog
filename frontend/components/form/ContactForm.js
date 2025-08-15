import { useState } from "react";
import { contactBlogAuthorForm } from "../../actions/form";

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "Send Message",
    success: false,
    error: false,
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Sending..." });
    
    try {
      const data = await contactBlogAuthorForm({
        authorEmail,
        name,
        email,
        message,
      });
      
      if (data.success) {
        setValues({
          ...values,
          sent: true,
          name: "",
          email: "",
          message: "",
          buttonText: "Sent",
          success: data.success,
        });
      }
    } catch (err) {
      setValues({
        ...values,
        buttonText: "Send Message",
        error: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: "Send Message",
    });
  };

  const showSuccessMessage = () => {
    if (success) {
      return (
        <div className="alert alert-success">Thank you for your message!</div>
      );
    }
  };

  const showErrorMessage = () => {
    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }
  };

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit} className="pb-5">
        <div className="form-group mb-3">
          <label className="form-label">Message</label>
          <textarea
            onChange={handleChange("message")}
            type="text"
            className="form-control"
            value={message}
            required
            rows="5"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
            required
            placeholder="Your name"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            required
            placeholder="Your email"
          />
        </div>

        <div>
          <button 
            className="btn btn-primary"
            disabled={buttonText === "Sending..." || buttonText === "Sent"}
          >
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      {showSuccessMessage()}
      {showErrorMessage()}
      {contactForm()}
    </div>
  );
};

export default ContactForm;
