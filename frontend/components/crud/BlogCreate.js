import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CreateBlog = ({ router }) => {
    const blogFromLS = () => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('blog') ? JSON.parse(localStorage.getItem('blog')) : '';
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);
    const [body, setBody] = useState(blogFromLS());
    const [photo, setPhoto] = useState(null);

    const [values, setValues] = useState({
        error: '',
        success: '',
        title: ''
    });

    const { error, success, title } = values;

    const token = getCookie('token');

    useEffect(() => {
        initCategories();
        initTags();
    }, [router]);

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues(v => ({ ...v, error: data.error }));
            } else {
                setCategories(data);
            }
        });
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues(v => ({ ...v, error: data.error }));
            } else {
                setTags(data);
            }
        });
    };

    const publishBlog = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('title', title);
        formData.set('body', body);
        formData.set('categories', JSON.stringify(checkedCategories));
        formData.set('tags', JSON.stringify(checkedTags));
        console.log('Photo:', photo);
        if (photo) {
            formData.set('photo', photo);
        }

        createBlog(formData, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: '',
                    success: `Blog titled "${data.title}" is created`,
                    error: ''
                });
                setBody('');
                setCheckedCategories([]);
                setCheckedTags([]);
                setPhoto(null);
                localStorage.removeItem('blog');
            }
        });
    };

    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        if (name === 'photo') {
            setPhoto(value);
        } else {
            setValues({ ...values, [name]: value, error: '' });
        }
    };

    const handleBody = e => {
        setBody(e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    const handleToggleCategory = c => () => {
        const clickedCategory = checkedCategories.indexOf(c);
        const all = [...checkedCategories];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }

        setCheckedCategories(all);
    };

    const handleToggleTag = t => () => {
        const clickedTag = checkedTags.indexOf(t);
        const all = [...checkedTags];

        if (clickedTag === -1) {
            all.push(t);
        } else {
            all.splice(clickedTag, 1);
        }

        setCheckedTags(all);
    };

    const showCategories = () =>
        categories &&
        categories.map((c, i) => (
            <li key={i} className="list-unstyled">
                <input onChange={handleToggleCategory(c._id)} type="checkbox" className="mr-2" checked={checkedCategories.includes(c._id)} />
                <label className="form-check-label">{c.name}</label>
            </li>
        ));

    const showTags = () =>
        tags &&
        tags.map((t, i) => (
            <li key={i} className="list-unstyled">
                <input onChange={handleToggleTag(t._id)} type="checkbox" className="mr-2" checked={checkedTags.includes(t._id)} />
                <label className="form-check-label">{t.name}</label>
            </li>
        ));

    const createBlogForm = () => (
        <form onSubmit={publishBlog}>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
            </div>

            <div className="form-group">
                <ReactQuill
                    modules={CreateBlog.modules}
                    formats={CreateBlog.formats}
                    value={body}
                    placeholder="Write something amazing..."
                    onChange={handleBody}
                />
            </div>

            <div className="form-group">
                <label className="btn btn-outline-info">
                    Upload featured image
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div>

            <div>
                <button type="submit" className="btn btn-primary">
                    Publish
                </button>
            </div>
        </form>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                </div>

                <div className="col-md-4">
                    <div>
                        <h5>Categories</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateBlog.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block']
    ]
};

CreateBlog.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
];

export default withRouter(CreateBlog);
