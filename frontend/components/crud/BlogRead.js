import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie, isAuth } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";

export const BlogRead = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = getCookie("token");
  const auth = isAuth();

  useEffect(() => {
    loadBlogs();
  }, [username]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await list(username);
      if (data.error) {
        console.error(data.error);
      } else {
        setBlogs(data);
      }
    } catch (err) {
      console.error("Error loading blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteConfirm = (slug) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(slug);
    }
  };

  const deleteBlog = async (slug) => {
    setMessage("");
    try {
      const data = await removeBlog(slug, token);
      if (data.error) {
        console.error(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const showUpdateButton = (slug) => {
    if (auth?.role === 0) {
      return (
        <Link href={`/user/crud/blog/${slug}`} className="btn btn-outline-primary btn-sm ms-2">
          Update
        </Link>
      );
    }
    if (auth?.role === 1) {
      return (
        <Link href={`/admin/crud/${slug}`} className="btn btn-outline-primary btn-sm ms-2">
          Update
        </Link>
      );
    }
  };

  const showDeleteButton = (slug, postedBy) => {
    if (!auth) return null;
    // Normalize both IDs to strings for comparison
    const authorId = postedBy && postedBy._id ? postedBy._id.toString() : postedBy.toString();
    if (auth._id === authorId) {
      return (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => deleteConfirm(slug)}
        >
          Delete
        </button>
      );
    }
    return null;
  };

  return (
    <div className="mt-4">
      <h4 className="mb-3">Update / Delete Blogs</h4>
      {message && <div className="alert alert-warning">{message}</div>}
      {loading ? (
        <p>Loading blogs…</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{blog.title}</h5>
              <p className="card-text text-muted">
                Written by <strong>{blog.postedBy.name}</strong> | {new Date(blog.updatedAt).toDateString()}
              </p>
              <div className="d-flex">
                {showDeleteButton(blog.slug, blog.postedBy)}
                {showUpdateButton(blog.slug)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
