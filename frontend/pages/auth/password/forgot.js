import Layout from "../../../components/Layout";
import ForgotPasswordComponent from "../../../components/auth/ForgotPasswordComponent";
import Link from "next/link";

const ForgotPassword = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <ForgotPasswordComponent />
            <br />
            <Link href="/signin" className="btn btn-sm btn-outline-danger">
              Back to signin
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
