// actions/category.js
import axios from 'axios';
import { API } from "../config";
// {name: 'mummy category'}
export const createCategory = async (category, token) => {
  console.log("token " + token, category);
  try {
    const response = await axios.post(
      `${API}/category`, 
      category,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};


export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${API}/categories`, 
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};



export const singleCategory = async (slug) => {
 
  try {
    const response = await axios.get(
      `${API}/category/${slug}`, 
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};


export const removeCategory = async (slug, token) => {
 
  try {
    const response = await axios.delete(
      `${API}/category/${slug}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};
