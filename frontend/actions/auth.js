import axios from "axios";
import { API } from "../config";
// in fetch we need to send body also json.stringify(user)
// but axios automaticaaly converts js objects to JSON

export const signup = async (user) => {
  try {
    const response = await axios.post(`${API}/signup`, user, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const signin = async (user) => {
  try {
    const response = await axios.post(`${API}/signin`, user, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

