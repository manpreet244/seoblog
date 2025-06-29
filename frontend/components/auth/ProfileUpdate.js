import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        userName: '',
        name: '',
        email: '',
        password: '',
        about: '',
        error: '',
        success: '',
        loading: false,
        photo: ''
    });

    const token = getCookie('token');
    const { userName, name, email, password, about, error, success, loading, photo } = values;

 useEffect(() => {
    getProfile(token).then(data => {
        if (data.error) {
            setValues(prev => ({ ...prev, error: data.error }));
        } else {
            setValues(prev => ({
                ...prev,
                userName: data.userName,
                name: data.name,
                email: data.email,
                about: data.about
            }));
        }
    });
}, [token]);


    const handleChange = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        setValues({ ...values, [name]: value, error: '', success: '' });
    };

   const handleSubmit = e => {
    e.preventDefault();

    setValues({ ...values, loading: true });
       console.log('Sending:', { userName, name, email, password, about, photo });

    let formData = new FormData();
    formData.set('userName', userName);
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('about', about);
    if (photo) {
        formData.set('photo', photo);
    }

  update(token, formData).then(data => {
    if (data.error) {
        setValues(prev => ({
            ...prev,
            error: data.error,
            loading: false
        }));
    } else {
        setValues(prev => ({
            ...prev,
            userName: data.userName,
            name: data.name,
            email: data.email,
            about: data.about,
            password: '',
            success: 'Profile updated successfully',
            loading: false
        }));
    }
});

};

    return (
        <div className="row">
            <div className="col-md-4">image preview here</div>
            <div className="col-md-8 mb-5">
                {loading && <div className="alert alert-info">Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label>Profile photo</label>
                        <input type="file" onChange={handleChange('photo')} accept="image/*" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" onChange={handleChange('userName')} value={userName} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" onChange={handleChange('name')} value={name} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" onChange={handleChange('email')} value={email} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>About</label>
                        <textarea onChange={handleChange('about')} value={about} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" onChange={handleChange('password')} value={password} className="form-control" />
                    </div>
                    <button type="submit"encType="multipart/form-data" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;
