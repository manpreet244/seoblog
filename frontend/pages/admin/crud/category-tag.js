import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import Layout from "../../../components/Layout";
import Category from "../../../components/crud/Category";
import Tag from "../../../components/crud/Tag";
const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Categories and Tags</h2>
            </div>
            <div className="col-md-6">
              <ul class="list-group">
               <Category/>
              </ul>
            </div>
            <div className="col-md-6">
              <ul class="list-group">
               <Tag/>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default CategoryTag;
