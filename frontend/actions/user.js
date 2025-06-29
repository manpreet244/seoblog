import axios from "axios";
import { API } from "../config";

export const userPublicProfile = (username) => {
  return axios.get(`${API}/user/${username}`, {
    headers: {
      Accept: "application/json",
    },
  })
    .then(res => res.data)
    .catch(err => {
      console.error("Error in userPublicProfile:", err.message);
      throw err;
    });
};


export const update = (token, user) => {
  return axios
    .put(`${API}/user/update`, user, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
            },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('Error updating user:', err.response?.data || err.message);
      throw err.response?.data || { error: 'Update failed' };
    });
};

export const getProfile = (token) => {

  return axios.get(`${API}/profile`, {
    headers: {
      Accept: "application/json",
      Authorization : `Bearer ${token}`
    },
  })
    .then(res => res.data)
    .catch(err => {
      console.error("Error in  user get Profile:", err.message);
      throw err;
    });
};
