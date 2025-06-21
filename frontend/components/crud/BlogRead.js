import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";

export const BlogRead = ({ router }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);
  const loadBlogs = () => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };
 const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete this blog?");
    if (answer) {
      deleteBlog(slug);
    }
  }
 const deleteBlog = (slug) => {
  removeBlog(slug , token).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      setMessage(data.message);
      loadBlogs();
    }
  });
};
  const showUpdateButton = (slug) =>{
    if(isAuth() && isAuth().role == 0){
        return(
            <Link href={`/user/crud/blog/${blog.slug}`}>Update</Link>
        )
    }else if(isAuth() && isAuth().role == 1){
        return (
            <Link href={`/admin/crud/${slug}`}>Update</Link>
        )
    }
  }

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="mt-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            Written by {blog.postedBy.name} | Published on{" "}
            {new Date(blog.updatedAt).toDateString()}
          </p>
          <button className="btn btn-small btn-danger" 
          onClick={()=>deleteConfirm(blog.slug)}>Delete</button>
         {showUpdateButton(blog.slug)}
        </div>
      );
    });
  };
  return (
    <>
      <p>Update / Delete Blogs</p>
      {message && <div className="alert alert-warning">{message}</div>}
      <div>{showAllBlogs()}</div>
    </>
  );
};
