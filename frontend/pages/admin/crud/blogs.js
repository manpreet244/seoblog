import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import Layout from "../../../components/Layout";
import {BlogRead} from "../../../components/crud/BlogRead";

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Categories and Tags</h2>
            </div>
            <div className="col-md-12">
              <ul class="list-group">
               <BlogRead/>
              </ul>
            </div>
         
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Blog;
