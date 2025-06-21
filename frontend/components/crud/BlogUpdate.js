import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Quillmodules, QuillFormats } from "../../helpers/quill";

const BlogUpdate = ({ router }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [values, setValues] = useState({
    error: "",
    success: "",
  });
  const [blog, setBlog] = useState(null);

  const token = getCookie("token");

  useEffect(() => {
    setFormData(new FormData());
    initBlog();
  }, [router]);

  const initBlog = () => {
    const slug = router.query.slug;
    if (slug) {
      singleBlog(slug).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setTitle(data.title);
          setBody(data.body);
          setBlog(data);
          formData.set("title", data.title);
          formData.set("body", data.body);
        }
      });
    }
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
  };

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);

    if (name === "photo") {
      setPhoto(value);
    } else if (name === "title") {
      setTitle(value);
    }
  };

  const publishBlog = (e) => {
    e.preventDefault();
    const slug = router.query.slug;

    updateBlog(formData, token, slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: "" });
      } else {
        setValues({
          ...values,
          success: `"${data.title}" has been successfully updated`,
          error: "",
        });
      }
    });
  };

  const updateBlogForm = () => (
    <div className="card shadow-sm mb-4 p-4">
      <form onSubmit={publishBlog}>
        <div className="form-group mb-3">
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
            placeholder="Enter blog title"
          />
        </div>

        <div className="form-group mb-3">
          <ReactQuill
            modules={Quillmodules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div className="form-group mb-3">
          <label className="btn btn-outline-info btn-sm">
            Upload featured image
            <input
              onChange={handleChange("photo")}
              type="file"
              accept="image/*"
              hidden
            />
          </label>
          {photo && <span className="ms-2 text-success">{photo.name}</span>}
        </div>

        <div>
          <button type="submit" className="btn btn-primary btn-sm">
            Update
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8 mb-4">
          <h2 className="mb-4">Update Blog</h2>
          {updateBlogForm()}
          {values.error && <div className="alert alert-danger mt-3">{values.error}</div>}
          {values.success && <div className="alert alert-success mt-3">{values.success}</div>}
        </div>
        <div className="col-md-4">
          <h5 className="fw-bold">Featured Image</h5>
          {blog && blog.photo && (
            <img
              src={`${process.env.NEXT_PUBLIC_API}/blog/photo/${blog.slug}`}
              alt="featured"
              className="img img-fluid"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
