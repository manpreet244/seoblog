import SignupComponent from "../components/auth/SignupComponent";
import Layout from "../components/Layout";
import Link from "next/link";
const Signup = ({ children }) => {
  return (
    <Layout >
          
     <SignupComponent/>
    </Layout>
  );
};

export default Signup;
