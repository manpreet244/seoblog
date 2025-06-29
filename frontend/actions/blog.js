import axios from "axios";
import { API } from "../config";
import queryString from "query-string";
import { isAuth } from "./auth";

export const createBlog = (blogData, token) => {
  let createBlogEndpoint;
  if (isAuth() && isAuth().role == 1) {
    createBlogEndpoint = `${API}/blog`;
  } else if (isAuth() && isAuth().role == 0) {
    createBlogEndpoint = `${API}/user/blog`;
  }

  return axios
    .post(`${createBlogEndpoint}`, blogData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create blog error:", err);
      throw err;
    });
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  // blogData is a FormData instance including 'photo' file
  return axios
    .post(
      `${API}/blogs-categories-tags`,
      { limit, skip },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log("API response:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Create blog error:", err);
      throw err;
    });
};

export const singleBlog = (slug) => {
  return axios
    .get(`${API}/blog/${slug}`)
    .then((res) => res.data)
    .catch((err) => {
      return { error: err };
    });
};

export const listRelated = (blog) => {
  return axios
    .post(
      `${API}/blogs/related`,
      {
        _id: blog._id,
        categories: blog.categories, // should be array of {_id: "..."}
        limit: 3,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log("API response:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Related blog fetch error:", err);
      throw err;
    });
};

export const list = (username) => {
  let listBlogEndpoint;

  if (username) {
    listBlogEndpoint = `${API}/${username}/blogs`; // ✅ username-based blogs
  } else {
    listBlogEndpoint = `${API}/blogs`; // ✅ all blogs
  }

  return axios
    .get(listBlogEndpoint) // ✅ use the correct endpoint
    .then((res) => res.data)
    .catch((err) => {
      return { error: err.response ? err.response.data : err.message };
    });
};


export const removeBlog = (slug, token) => {
  return axios
    .delete(`${API}/blog/${slug}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Delete blog error:", err);
      return { error: err.response?.data?.error || "Delete failed" };
    });
};

export const updateBlog = (blogData, token, slug) => {
  // blogData is a FormData instance including 'photo' file
  return axios
    .put(`${API}/blog/${slug}`, blogData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error("Create blog error:", err);
      throw err;
    });
};

export const listSearch = (params) => {
  let query = queryString.stringify(params);
  return axios
    .get(`${API}/blogs/search?${query}`)
    .then((res) => res.data)
    .catch((err) => {
      return { error: err };
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
