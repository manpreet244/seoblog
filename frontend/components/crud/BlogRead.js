import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie, isAuth } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";

export const BlogRead = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete this blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const showUpdateButton = (slug) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/blog/${slug}`} className="btn btn-outline-primary btn-sm ms-2">
          Update
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${slug}`} className="btn btn-outline-primary btn-sm ms-2">
          Update
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <div key={i} className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{blog.title}</h5>
          <p className="card-text text-muted">
            Written by <strong>{blog.postedBy.name}</strong> |{" "}
            {new Date(blog.updatedAt).toDateString()}
          </p>
          <div className="d-flex">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteConfirm(blog.slug)}
            >
              Delete
            </button>
            {showUpdateButton(blog.slug)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-4">
      <h4 className="mb-3">Update / Delete Blogs</h4>
      {message && <div className="alert alert-warning">{message}</div>}
      <div>{showAllBlogs()}</div>
    </div>
  );
};
