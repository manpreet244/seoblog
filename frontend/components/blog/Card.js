import Link from 'next/link';
import parse from 'html-react-parser';
import { API } from '../../config';
const Card = ({ blog }) => {

    const showBlogCategories = () => {
        return blog.categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i} passHref>
                <span className="badge bg-light text-primary border me-2 mb-2 p-2 rounded-pill cursor-pointer">
                    #{c.name}
                </span>
            </Link>
        ));
    };

   
    const showBlogTags = () => {
        return blog.tags.map((t, i) => (
            <Link href={`/tags/${t.slug}`} key={i} passHref>
                <span className="badge bg-secondary-subtle text-secondary me-2 mb-2 p-2 rounded-pill cursor-pointer">
                    #{t.name}
                </span>
            </Link>
        ));
    };

    return (
        <div className="p-4 bg-white shadow-sm rounded mb-4 border">
            <header className="mb-3">
                <Link href={`/blogs/${blog.slug}`} passHref>
                    <h2 className="h4 text-primary fw-bold mb-1 hover-underline">{blog.title}</h2>
                </Link>
                <p className="text-secondary small mb-0">
                    ✍️ <span className="fw-semibold">{blog.postedBy?.name}</span> |
                    🗓 {new Date(blog.updatedAt).toLocaleDateString()}
                </p>
            </header>

            <section className="mb-2">
                {showBlogCategories(blog)}
                {showBlogTags(blog)}
            </section>

            <div className="row g-3 mt-2">
                <div className="col-md-4 d-flex align-items-center justify-content-center text-muted bg-light rounded p-3 border">
                    <span className="fst-italic">
                        <section>
                           <img src={`${API}/blog/photo/${blog.slug}`} 
                           className='img img-fluid'
                           alt={blog.title}
                            style={{maxHeight:'150px'  , width:'auto'}}/>
                        </section>
                    </span>
                </div>
                <div className="col-md-8">
                    <div className="mb-2 text-dark small">{parse(blog.excerpt)}</div>
                    <Link href={`/blogs/${blog.slug}`} passHref>
                        <button className="btn btn-outline-primary btn-sm mt-2">Read more →</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Card;
