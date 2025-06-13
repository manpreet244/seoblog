import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Quillmodules , QuillFormats } from "../../helpers/quill";

const CreateBlog = ({ router }) => {
  const blogFromLS = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("blog")
      ? JSON.parse(localStorage.getItem("blog"))
      : "";
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [body, setBody] = useState(blogFromLS());
  const [photo, setPhoto] = useState(null);

  const [values, setValues] = useState({
    error: "",
    success: "",
    title: "",
  });

  const { error, success, title } = values;

  const token = getCookie("token");

  useEffect(() => {
    initCategories();
    initTags();
  }, [router]);

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues((v) => ({ ...v, error: data.error }));
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues((v) => ({ ...v, error: data.error }));
      } else {
        setTags(data);
      }
    });
  };

const publishBlog = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.set("title", title);
  formData.set("body", body);
  formData.set("categories", JSON.stringify(checkedCategories));
  formData.set("tags", JSON.stringify(checkedTags));
  if (photo) {
    formData.set("photo", photo);
  }

  try {
    const data = await createBlog(formData, token);
    setValues({
      ...values,
      title: "",
      success: `Blog titled "${data.title}" is created`,
      error: "",
    });
    setBody("");
    setCheckedCategories([]);
    setCheckedTags([]);
    setPhoto(null);
    localStorage.removeItem("blog");
  } catch (err) {
    // Axios error handling:
    const apiError =
      err.response && err.response.data && err.response.data.error
        ? err.response.data.error
        : "Something went wrong. Please try again.";

    setValues({ ...values, error: apiError, success: "" });
  }
};

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    if (name === "photo") {
      setPhoto(value);
    } else {
      setValues({ ...values, [name]: value, error: "" });
    }
  };

  const handleBody = (e) => {
    setBody(e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleToggleCategory = (c) => () => {
    const clickedCategory = checkedCategories.indexOf(c);
    const all = [...checkedCategories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    setCheckedCategories(all);
  };

  const handleToggleTag = (t) => () => {
    const clickedTag = checkedTags.indexOf(t);
    const all = [...checkedTags];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }

    setCheckedTags(all);
  };

  const showCategories = () =>
    categories &&
    categories.map((c, i) => (
      <li key={i} className="list-unstyled mb-2">
        <input
          onChange={handleToggleCategory(c._id)}
          type="checkbox"
          className="form-check-input me-2"
          checked={checkedCategories.includes(c._id)}
        />
        <label className="form-check-label">{c.name}</label>
      </li>
    ));

  const showTags = () =>
    tags &&
    tags.map((t, i) => (
      <li key={i} className="list-unstyled mb-2">
        <input
          onChange={handleToggleTag(t._id)}
          type="checkbox"
          className="form-check-input "
          checked={checkedTags.includes(t._id)}
        />
        <label className="form-check-label">{t.name}</label>
      </li>
    ));

  const createBlogForm = () => (
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
            Publish
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8 mb-4">
          <h2 className="mb-4">Create a New Blog</h2>

          
                {createBlogForm()}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
          {success && <div className="alert alert-success mt-3">{success}</div>}

    
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm mb-4 p-3">
            <h5 className="fw-bold">Categories</h5>
            <hr />
            <ul
              className="ps-0"
              style={{ maxHeight: "200px", overflowY: "scroll" }}
            >
              {showCategories()}
            </ul>
          </div>
          <div className="card shadow-sm p-3">
            <h5 className="fw-bold">Tags</h5>
            <hr />
            <ul
              className="ps-0"
              style={{ maxHeight: "200px", overflowY: "scroll" }}
            >
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};



export default withRouter(CreateBlog);
