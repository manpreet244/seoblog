import axios from "axios";
import { API } from "../config";
import cookie from "js-cookie";
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

export const signout = async (next) => {
  try {
    const response = await axios.get(`${API}/signout`);
    console.log(response.data);
    removeCookie("token");
    removeLocalStorage("user");
    next();
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

//setCookie
export const setCookie = (key , value) => {
  if(typeof window !== "undefined"){
    cookie.set(key , value , {
      expires : 1
    }
    )
  }
}
//get Cookie
export const getCookie = (key) => {
  if(typeof window !== "undefined"){
    return cookie.get(key);
  }
  return null;
}

//remove cookie
export const removeCookie = (key) => {
  if(typeof window !== "undefined"){
    cookie.remove(key , {
      expires : 1
    }
    )
  }
}
//localStorage
export const setLocalStorage = (key , value) => {
   if(typeof window !== "undefined"){
    localStorage
      .setItem(key , JSON.stringify(value)) 
  }
}
//
export const removeLocalStorage = (key) => {
    if(typeof window !== "undefined"){
    localStorage.removeItem(key)
}
}
//authenticate usesr by pass data to cookie and local storage                     


export const authenticate = (response , next) => {
  setCookie('token' , response.token)
  setLocalStorage('user' , response.user)
  next()
}

//isAuth is used to check if user is authenticated , its needed in cases

// /auth.js
export const isAuth = () => {
  if(typeof window == "undefined"){
    return false;
  }
  if(localStorage.getItem('user')){
    return JSON.parse(localStorage.getItem('user'))
  }else{
    return false;
  }
}
