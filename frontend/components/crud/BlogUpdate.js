import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie } from "../../actions/auth";
import { singleBlog, updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Quillmodules, QuillFormats } from "../../helpers/quill";

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [values, setValues] = useState({
    title: "",
    body: "",
    error: "",
    success: "",
    formData: '',
  });

  const token = getCookie("token");
  const { error, success, formData } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
  }, [router.query.slug]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setTitle(data.title);
          setBody(data.body);
          setValues((prev) => ({ ...prev, formData: new FormData() }));
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
    if (name === "photo") setPhoto(value);
    else if (name === "title") setTitle(value);
    formData.set(name, value);
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: "" });
      } else {
        setValues({ ...values, success: "Blog updated successfully!", error: "" });
        Router.push(`/admin/crud/blogs`);
      }
    });
  };

  const updateBlogForm = () => (
    <div className="card shadow-sm mb-4 p-4">
      <form onSubmit={editBlog}>
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

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {updateBlogForm()}
        </div>

        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5>Featured image</h5>
            <hr />
            <small className="text-muted">Max size: 1mb</small>
            <br />
            <label className="btn btn-outline-info">
              Upload featured image
              <input
                onChange={handleChange("photo")}
                type="file"
                accept="image/*"
                hidden
              />
            </label>
            {photo && <p className="text-success mt-2">{photo.name}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
