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
        message: `${Array.isArray(data) ? data.length : 0} blog${data.length === 1 ? '' : 's'} found`
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
    <div className="jumbotron bg-white">
      {message && <p className="pt-4 text-muted font-italic">{message}</p>}
      {results.length === 0 ? (
        <p className="text-danger">No blogs matched your query.</p>
      ) : (
        results.map((blog, i) => (
          <div key={i}>
            <Link href={`/blogs/${blog.slug}`}>
              <span className="text-primary" style={{ cursor: 'pointer' }}>{blog.title}</span>
            </Link>
          </div>
        ))
      )}
    </div>
  );

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search blogs"
            onChange={handleChange}
            value={search}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-block btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="pt-3 pb-5">{searchForm()}</div>
      {searched && <div className="pt-3">{searchedBlogs()}</div>}
    </div>
  );
};

export default withRouter(Search);
