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
