import Layout from "../../../../components/Layout";
import ResetPasswordComponent from "../../../../components/auth/ResetPasswordComponent";

const ResetPassword = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <ResetPasswordComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
