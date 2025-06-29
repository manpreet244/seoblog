import Link from "next/link";
import Private from "../../../components/auth/Private";
import Layout from "../../../components/Layout";
import BlogCreate from "../../../components/crud/BlogCreate";
const CreateBlog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Categories and Tags</h2>
            </div>
            <div className="col-md-12">
              <ul class="list-group">
               <BlogCreate/>
              </ul>
            </div>
         
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default CreateBlog;
