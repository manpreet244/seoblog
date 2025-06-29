import Link from 'next/link';
import parse from 'html-react-parser';
import { API } from '../../config';

const Card = ({ blog }) => {
  const showBlogCategories = () =>
    blog.categories.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i} passHref>
        <span
          style={{
            textDecoration: 'none',
            backgroundColor: '#f3e6fb',
            color: '#c634eb',
            cursor: 'pointer',
            border: '1px solid #c634eb',
            padding: '6px 12px',
            marginRight: '8px',
            marginBottom: '8px',
            borderRadius: '20px',
            display: 'inline-block',
          }}
        >
          #{c.name}
        </span>
      </Link>
    ));

  const showBlogTags = () =>
    blog.tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i} passHref>
        <span
          style={{
            textDecoration: 'none',
            backgroundColor: '#ececec',
            color: '#6c757d',
            cursor: 'pointer',
            border: '1px solid #ced4da',
            padding: '6px 12px',
            marginRight: '8px',
            marginBottom: '8px',
            borderRadius: '20px',
            display: 'inline-block',
          }}
        >
          #{t.name}
        </span>
      </Link>
    ));

  return (
    <div
      className="p-4 shadow-sm rounded mb-4 border"
      style={{
        background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
        color: '#312a33',
      }}
    >
      <header className="mb-3">
        <Link href={`/blogs/${blog.slug}`} passHref>
          <h2
            className="h4 fw-bold mb-1"
            style={{
              color: '#c634eb',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            {blog.title}
          </h2>
        </Link>
        <p className="small mb-0" style={{ color: '#6c757d' }}>
          <Link href={`/profile/${blog.postedBy?.userName}`} passHref>
            <span
              style={{
                textDecoration: 'none',
                color: '#312a33',
                cursor: 'pointer',
              }}
            >
              ✍️ <span className="fw-semibold">{blog.postedBy?.userName}</span> |
            </span>
          </Link>{' '}
          🗓 {new Date(blog.updatedAt).toLocaleDateString()}
        </p>
      </header>

      <section className="mb-2">{showBlogCategories()} {showBlogTags()}</section>

      <div className="row g-3 mt-2">
        <div className="col-md-4 d-flex align-items-center justify-content-center bg-light rounded p-3 border">
          <img
            src={`${API}/blog/photo/${blog.slug}`}
            className="img img-fluid"
            alt={blog.title}
            style={{ maxHeight: '150px', width: 'auto' }}
          />
        </div>
        <div className="col-md-8">
          <div className="mb-2 small">{parse(blog.excerpt)}</div>
          <Link href={`/blogs/${blog.slug}`} passHref>
            <button
              className="btn btn-sm mt-2"
              style={{
                border: '1px solid #c634eb',
                color: '#c634eb',
                backgroundColor: '#fff',
              }}
            >
              Read more →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
