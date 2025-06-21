import axios from 'axios';
import { API } from '../config';
export const createBlog = (blogData, token) => {
  // blogData is a FormData instance including 'photo' file
  return axios.post(`${API}/blog`, blogData, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => res.data)
  .catch(err => {
    console.error('Create blog error:', err);
    throw err;
  });
};

export const listBlogsWithCategoriesAndTags = (skip , limit) => {
  // blogData is a FormData instance including 'photo' file
  return axios.post(`${API}/blogs-categories-tags`, {limit , skip} , {
    headers: {
      Accept: 'application/json',
      'Content-Type' :'application/json'
    },
  })
   .then(res => {
      console.log("API response:", res.data);
      return res.data;
    })
  .catch(err => {
    console.error('Create blog error:', err);
    throw err;
  });
};


export const singleBlog = (slug) => {
  return axios
    .get(`${API}/blog/${slug}`)
    .then((res) => res.data) 
    .catch((err) => {
      return { error: err}; 
    });
};


export const listRelated = (blog ) => {
  // blogData is a FormData instance including 'photo' file
  return axios.get(`${API}/blogs/`, {
    headers: {
      Accept: 'application/json',
      'Content-Type' :'application/json'
    },
  })
   .then(res => {
      console.log("API response:", res.data);
      return res.data;
    })
  .catch(err => {
    console.error('Create blog error:', err);
    throw err;
  });
};

export const list = () => {
  return axios
    .get(`${API}/blogs`) // Or whatever your endpoint is for ALL blogs
    .then((res) => res.data)
    .catch((err) => {
      return { error: err };
    });
};


export const removeBlog = (slug, token) => {
  return axios
    .delete(`${API}/blog/${slug}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('Delete blog error:', err);
      return { error: err.response?.data?.error || 'Delete failed' };
    });
};

export const updateBlog = (blogData, token , slug) => {
  // blogData is a FormData instance including 'photo' file
  return axios.put(`${API}/blog/${slug}`, blogData, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => res.data)
  .catch(err => {
    console.error('Create blog error:', err);
    throw err;
  });
};


// export const getCategories = async () => {
//   try {
//     const response = await axios.get(
//       `${API}/categories`, 
//     );
//     return response.data;
//   } catch (error) {
//     return { error: error.response?.data?.error || 'Something went wrong' };
//   }
// };



// export const singleCategory = async (slug) => {
 
//   try {
//     const response = await axios.get(
//       `${API}/category/${slug}`, 
//     );
//     return response.data;
//   } catch (error) {
//     return { error: error.response?.data?.error || 'Something went wrong' };
//   }
// };


// export const removeCategory = async (slug, token) => {
 
//   try {
//     const response = await axios.delete(
//       `${API}/category/${slug}`, 
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return { error: error.response?.data?.error || 'Something went wrong' };
//   }
// };
