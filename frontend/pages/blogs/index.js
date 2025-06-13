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
        <main className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-info">📰 Latest Blog Posts</h1>
            <p className="text-muted">Explore tech, development, and more from our authors.</p>
          </div>

          <section className="mb-5">
            <div className="mb-4 text-center">
              <h5 className="text-dark fw-semibold mb-3">📂 Categories</h5>
              <div className="d-flex flex-wrap justify-content-center">{showAllCategories()}</div>
            </div>

            <div className="text-center">
              <h5 className="text-dark fw-semibold mb-3">🏷️ Tags</h5>
              <div className="d-flex flex-wrap justify-content-center">{showAllTags()}</div>
            </div>
          </section>

          <div className="px-md-5">
            {showAllBlogs()}
            {showLoadedBlogs()}
            {loadMoreButton()}
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
