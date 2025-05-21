import Layout from "../components/Layout";
import SigninComponent from "../components/auth/SigninComponent";

const Signin = ({children}) =>{
    return (
       <Layout>
  <SigninComponent/>
       </Layout>
    )
}

export default Signin;