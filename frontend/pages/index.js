import { useState, useEffect } from "react";
import Link from "next/link";
import parse from 'html-react-parser';
import Layout from "../components/Layout";
import { listBlogsWithCategoriesAndTags } from "../actions/blog";
import { API } from "../config";

const Index = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await listBlogsWithCategoriesAndTags(0, 6); // Get 6 latest blogs
      if (data && data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const showBlogExcerpt = (blog) => {
    if (blog.excerpt && blog.excerpt.length > 150) {
      return parse(blog.excerpt.substring(0, 150) + "...");
    }
    return parse(blog.excerpt || "Discover amazing insights and stories...");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "100px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1
                className="display-4 fw-bold mb-4"
                style={{ fontSize: "3.5rem" }}
              >
                Welcome to Our Blog
              </h1>
              <p className="lead mb-5" style={{ fontSize: "1.3rem" }}>
                Discover amazing stories, insights, and knowledge from our community of writers.
                Explore diverse topics and join the conversation.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/blogs" className="btn btn-light btn-lg px-4 py-2">
                  Explore All Blogs
                </Link>
                <Link href="/user/crud/blog" className="btn btn-outline-light btn-lg px-4 py-2">
                  Start Writing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform?</h2>
              <p className="lead text-muted">Everything you need to share your thoughts with the world</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4">
                <div
                  className="feature-icon mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-edit" style={{ fontSize: "2rem", color: "#1976d2" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Easy Writing</h4>
                <p className="text-muted">
                  Create beautiful blog posts with our intuitive editor. Rich text formatting and media support included.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div
                  className="feature-icon mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f3e5f5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-users" style={{ fontSize: "2rem", color: "#7b1fa2" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Community</h4>
                <p className="text-muted">
                  Connect with like-minded writers and readers. Share ideas, get feedback, and grow together.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4">
                <div
                  className="feature-icon mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#e8f5e8",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: "2rem", color: "#388e3c" }}></i>
                </div>
                <h4 className="fw-bold mb-3">Discover</h4>
                <p className="text-muted">
                  Find content that matters to you. Advanced search and categorization help you explore topics you love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Latest Stories</h2>
              <p className="lead text-muted">Fresh perspectives and insights from our community</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <div key={blog._id} className="col-lg-4 col-md-6">
                    <div
                      className="card h-100 shadow-sm border-0"
                      style={{ transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      {blog.photo && (
                        <img
                          src={`${API}/api/blog/photo/${blog.slug}`}
                          alt={blog.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          {blog.categories?.slice(0, 2).map((category) => (
                            <span
                              key={category._id}
                              className="badge me-1"
                              style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                        <h5 className="card-title fw-bold mb-3">
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="text-decoration-none text-dark"
                            style={{ lineHeight: "1.3" }}
                          >
                            {blog.title}
                          </Link>
                        </h5>
                        <p className="card-text text-muted flex-grow-1">
                          {showBlogExcerpt(blog)}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                          <small className="text-muted">
                            By {blog.postedBy?.name || "Anonymous"}
                          </small>
                          <small className="text-muted">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4 className="text-muted">No blogs available yet</h4>
                  <p className="text-muted">Be the first to share your story!</p>
                  <Link href="/user/crud/blog" className="btn btn-primary btn-lg">
                    Write First Blog
                  </Link>
                </div>
              )}
            </div>
          )}

          {blogs.length > 0 && (
            <div className="text-center mt-5">
              <Link href="/blogs" className="btn btn-outline-primary btn-lg">
                View All Blogs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(45deg, #ff6b6b, #feca57)",
          color: "white",
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Ready to Share Your Story?</h2>
              <p className="lead mb-4">
                Join thousands of writers who are already sharing their knowledge and experiences.
                Your voice matters, and your story can inspire others.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/signup" className="btn btn-light btn-lg px-4 py-2">
                  Get Started Today
                </Link>
                <Link href="/signin" className="btn btn-outline-light btn-lg px-4 py-2">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add FontAwesome for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
    </Layout>
  );
};

export default Index;


