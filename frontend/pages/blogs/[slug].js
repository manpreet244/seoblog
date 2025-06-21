import Layout from "../../components/Layout";
import { singleBlog, listRelated } from "../../actions/blog";
import Head from "next/head";
import Link from "next/link";
import { API, DOMAIN, APP_NAME } from "../../config";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import SmallCard from "../../components/blog/SmallCard";
import { useRouter } from "next/router";

const SingleBlog = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlogData(slug);
    }
  }, [slug]);

  const fetchBlogData = async (slug) => {
    const data = await singleBlog(slug);
    if (data.error) {
      console.error(data.error);
    } else {
      setBlog(data);
      loadRelated(data);
    }
  };

  const loadRelated = (blog) => {
    listRelated(blog).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  const showBlogCategories = () =>
    blog?.categories.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i} passHref legacyBehavior>
        <a className="badge bg-primary me-2 mb-2 p-2 rounded-pill text-decoration-none">
          #{c.name}
        </a>
      </Link>
    ));

  const showBlogTags = () =>
    blog?.tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i} passHref legacyBehavior>
        <a className="badge bg-secondary me-2 mb-2 p-2 rounded-pill text-decoration-none">
          #{t.name}
        </a>
      </Link>
    ));

  const showRelatedBlogs = () => {
    return (
      <div className="row">
        {related.map((r, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <SmallCard blog={r} />
          </div>
        ))}
      </div>
    );
  };

  if (!blog) return null;

  return (
    <>
      <Layout>
        <Head>
          <title>
            {blog.title} | {APP_NAME}
          </title>
          <meta name="description" content={blog.excerpt} />
          <link rel="canonical" href={`${DOMAIN}/blogs/${blog.slug}`} />
        </Head>

        <main className="bg-light py-5">
          <div className="container">
            <div className="card shadow-sm border-0">
              <img
                src={`${API}/blog/photo/${blog.slug}`}
                alt={blog.title}
                className="card-img-top img-fluid"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h1 className="card-title display-5 fw-bold">{blog.title}</h1>
                <p className="text-muted mb-3">
                  ✍️ <strong>{blog.postedBy?.name}</strong> | 🗓{" "}
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </p>

                <div className="mb-3">{showBlogCategories()}</div>
                <div className="mb-4">{showBlogTags()}</div>

                <div className="lead" style={{ lineHeight: "1.8" }}>
                  {parse(blog.body)}
                </div>
              </div>

              <div className="px-4 pb-4">
                <h4>Related Blogs</h4>
                <hr />
                {showRelatedBlogs()}
              </div>

              <div className="px-4 pb-4">
                <h4>Comments</h4>
                <p>Show Comments</p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default SingleBlog;
