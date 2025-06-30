// actions/tag.js
import axios from 'axios';
import { API } from "../config";
import { handleResponse } from './auth';
// actions/tag.js
export const createTag = async (name, token) => {
    console.log(name )
  try {
    const response = await axios.post(
      `${API}/tag`,
      { name }, // send plain { name: 'something' }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
     handleResponse(response)
    return response.data;
  } catch (error) {
    console.error('createTag error:', error.response?.data || error.message);
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};

export const getTags= async () => {
  try {
    const response = await axios.get(
      `${API}/tags`, 
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};


export const singleTag = async (slug) => {
  console.log(token, tag);
  try {
    const response = await axios.get(
      `${API}/tag/${slug}`, 
    );
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};

export const removeTag = async (slug, token) => {
 
  try {
    const response = await axios.delete(
      `${API}/tag/${slug}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
     handleResponse(response)
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Something went wrong' };
  }
};
