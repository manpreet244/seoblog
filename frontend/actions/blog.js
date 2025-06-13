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
