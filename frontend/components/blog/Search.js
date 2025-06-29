import Link from 'next/link';
import { useState } from 'react';
import { listSearch } from '../../actions/blog';
import { withRouter } from 'next/router';

const Search = ({ router }) => {
  const [values, setValues] = useState({
    search: '',
    results: [],
    searched: false,
    message: ''
  });

  const { search, results, searched, message } = values;

  const handleChange = (e) => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
      message: ''
    });
  };

  const searchSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await listSearch({ search });
      setValues({
        ...values,
        results: Array.isArray(data) ? data : [],
        searched: true,
        message: `${Array.isArray(data) ? data.length : 0} blog${
          data.length === 1 ? '' : 's'
        } found`
      });
    } catch (err) {
      console.error(err);
      setValues({
        ...values,
        results: [],
        searched: true,
        message: 'Error fetching search results'
      });
    }
  };

  const searchedBlogs = () => (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
      {message && (
        <p
          style={{
            paddingTop: '1rem',
            color: '#6c757d',
            fontStyle: 'italic',
            fontSize: '0.9rem'
          }}
        >
          {message}
        </p>
      )}
      {results.length === 0 ? (
        <p style={{ color: 'red' }}>No blogs matched your query.</p>
      ) : (
        results.map((blog, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <Link href={`/blogs/${blog.slug}`} passHref>
              <span
                style={{
                  color: '#c634eb',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                {blog.title}
              </span>
            </Link>
          </div>
        ))
      )}
    </div>
  );

  const searchForm = () => (
    <form onSubmit={searchSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <input
          type="search"
          placeholder="Search blogs"
          onChange={handleChange}
          value={search}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ced4da',
            fontSize: '0.95rem',
            color: '#312a33',
            width: '100%',
            minWidth: '0'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#fff',
            border: '1px solid #c634eb',
            color: '#c634eb',
            padding: '10px 16px',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>
    </form>
  );

  return (
    <div
      style={{
        paddingTop: '2rem',
        paddingBottom: '2rem',
        background: 'linear-gradient(to right, #fdfbff, #f2f2f2)',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        {searchForm()}
        {searched && <div className="pt-3">{searchedBlogs()}</div>}
      </div>
    </div>
  );
};

export default withRouter(Search);
