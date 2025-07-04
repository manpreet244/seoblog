import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import Layout from "../../../components/Layout";
import BlogCreate from "../../../components/crud/BlogCreate";
const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Blogs</h2>
            </div>
            <div className="col-md-12">
              <ul class="list-group">
               <BlogCreate/>
              </ul>
            </div>
         
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Blog;
