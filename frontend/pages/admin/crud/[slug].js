import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import Layout from "../../../components/Layout";
import BlogUpdate from "../../../components/crud/BlogUpdate";
const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update Blogs</h2>
            </div>
            <div className="col-md-12">
              <ul class="list-group">
               <BlogUpdate/>
              </ul>
            </div>
         
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Blog;
