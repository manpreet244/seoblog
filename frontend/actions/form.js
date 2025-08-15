import axios from "axios";
import { API } from "../config";

export const contactForm = async (data) => {
  try {
    const response = await axios.post(`${API}/contact`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Contact form error:", err);
    throw err;
  }
};

export const contactBlogAuthorForm = async (data) => {
  try {
    const response = await axios.post(`${API}/contact-blog-author`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Contact blog author error:", err);
    throw err;
  }
};
