import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog , updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Quillmodules, QuillFormats } from "../../helpers/quill";

const BlogUpdate = ({ router }) => {
    const [blog , setBlog] = useState({})
    useEffect(()=>{
        initBlog()
    } , [])
    const initBlog = () => {
        // Fetch the blog data using the slug from the router
        const slug = router.query.slug;
        if (slug) {
          singleBlog(slug).then((data) => {
            if (data.error) {
              console.log(data.error);
            } else {
              setBlog(data);
            }
          });   
        }
    }
  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-md-8 mb-4">
          <p>{JSON.stringify(blog)}</p>
          <div>show success and error msg</div>
        </div>
        <div className="col-md-4">
          <h5> Featured image</h5>
        </div>
      </div>
    </div>
  );
};
export default withRouter(BlogUpdate);