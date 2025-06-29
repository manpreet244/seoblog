import Layout from "../../components/Layout";
import { listBlogsWithCategoriesAndTags } from "../../actions/blog";
import Card from "../../components/blog/Card";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import { API, DOMAIN, APP_NAME } from "../../config";
import { withRouter } from "next/router";

const Blogs = ({ blogs, categories, tags, totalBlogs, blogLimit, blogSkip, router }) => {
  const [limit, setLimit] = useState(blogLimit);
  const [skip, setSkip] = useState(blogSkip);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const head = () => (
    <Head>
      <title>Programming Blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Programming blogs and tutorials on React, Node, Next, Vue, Laravel and web development"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Latest development tutorials | ${APP_NAME}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.png`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.png`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="fb:app_id" content="YOUR_FB_APP_ID" />
    </Head>
  );

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary btn-lg px-4" onClick={loadMore}>
            Load More
          </button>
        </div>
      )
    );
  };

  const showAllBlogs = () =>
    blogs.map((blog, i) => (
      <article
        key={i}
        className="card mb-4 border-0 shadow-sm p-4 blog-card bg-light-subtle hover-shadow transition-all"
      >
        <Card blog={blog} />
      </article>
    ));

  const showLoadedBlogs = () =>
    loadedBlogs.map((blog, i) => (
      <article
        key={i}
        className="card mb-4 border-0 shadow-sm p-4 blog-card bg-light-subtle hover-shadow transition-all"
      >
        <Card blog={blog} />
      </article>
    ));

  const showAllCategories = () =>
    categories?.map((c, i) => (
      <Link
        href={`/categories/${c.slug}`}
        key={i}
        className="btn btn-primary btn-sm me-2 mb-2 px-3 py-2 text-white"
      >
        {c.name}
      </Link>
    ));

  const showAllTags = () =>
    tags.map((t, i) => (
      <Link
        href={`/tags/${t.slug}`}
        key={i}
        className="btn btn-outline-secondary btn-sm me-2 mb-2 px-3 py-2"
      >
        {t.name}
      </Link>
    ));

  return (
    <>
      {head()}
      <Layout>
     <main
  className="container py-5"
  style={{
    color: "#312a33",
  }}
>
  <div className="text-center mb-5">
    <h1
      className="display-5 fw-bold"
      style={{ color: "#c634eb" }}
    >
      Latest Blog Posts
    </h1>
    <p className="lead">Explore tech, development, and more from our authors.</p>
  </div>

  <section className="mb-5">
    <div className="mb-4 text-center">
      <h5 className="fw-semibold mb-3" style={{ color: "#c634eb" }}>
        📂 Categories
      </h5>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {categories?.map((c, i) => (
          <Link
            key={i}
            href={`/categories/${c.slug}`}
            style={{
              textDecoration: "none",
              backgroundColor: "#c634eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>

    <div className="text-center">
      <h5 className="fw-semibold mb-3" style={{ color: "#c634eb" }}>
        🏷️ Tags
      </h5>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {tags?.map((t, i) => (
          <Link
            key={i}
            href={`/tags/${t.slug}`}
            style={{
              textDecoration: "none",
              border: "2px solid #c634eb",
              color: "#c634eb",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            {t.name}
          </Link>
        ))}
      </div>
    </div>
  </section>

  <div className="px-md-5">
    {blogs.map((blog, i) => (
      <article
        key={i}
        className="card mb-4 border-0 shadow-sm p-4"
        style={{
          backgroundColor: "#fff",
          borderLeft: "5px solid #c634eb",
        }}
      >
        <Card blog={blog} />
      </article>
    ))}

    {loadedBlogs.map((blog, i) => (
      <article
        key={i}
        className="card mb-4 border-0 shadow-sm p-4"
        style={{
          backgroundColor: "#fff",
          borderLeft: "5px solid #c634eb",
        }}
      >
        <Card blog={blog} />
      </article>
    ))}

    {size > 0 && size >= limit && (
      <div className="text-center mt-4">
        <button
          className="btn"
          onClick={loadMore}
          style={{
            backgroundColor: "#c634eb",
            color: "white",
            padding: "10px 30px",
            fontSize: "1rem",
            borderRadius: "25px",
          }}
        >
          Load More
        </button>
      </div>
    )}
  </div>
</main>


      </Layout>
    </>
  );
};

Blogs.getInitialProps = async () => {
  let skip = 0;
  let limit = 2;
  try {
    const data = await listBlogsWithCategoriesAndTags(skip, limit);
    return {
      blogs: data.blogs,
      categories: data.categories,
      tags: data.tags,
      totalBlogs: data.size,
      blogLimit: limit,
      blogSkip: skip,
    };
  } catch (err) {
    console.error("Blog fetch error:", err);
    return { blogs: [], categories: [], tags: [], totalBlogs: 0, blogLimit: limit, blogSkip: skip };
  }
};

export default withRouter(Blogs);
