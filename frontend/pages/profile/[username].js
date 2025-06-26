import Layout from "../../components/Layout";
import { userPublicProfile } from "../../actions/user";
import Head from "next/head";
import Link from "next/link";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import moment from "moment";

const UserProfile = ({ user, blogs }) => {
  const showUserBlogs = () => {
    return blogs.map((blog, i) => (
      <div className="mt-4 mb-4" key={i}>
        <Link href={`/blogs/${blog.slug}`} legacyBehavior>
          <a>{blog.title}</a>
        </Link>
      </div>
    ));
  };

  const head = () => (
    <Head>
      <title>{user.name} | {APP_NAME}</title>
      <meta name="description" content={`Blogs by ${user.userName}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${user.userName}`} />
      <meta property="og:title" content={`${user.userName} | ${APP_NAME}`} />
      <meta property="og:description" content={`Blogs by ${user.userName}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/profile/${user.userName}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={FB_APP_ID} />
    </Head>
  );

  if (!user) return <p>User not found</p>;

  return (
    <>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5>{user.name}</h5>
                  <Link href={user.profile} legacyBehavior>
                    <a>View Profile</a>
                  </Link>
                  <p>Joined {moment(user.createdAt).fromNow()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="bg-primary pt-4 p-4 text-white pb-4">
                    Recent blogs by {user.name}
                  </h5>
                  <br />
                  {showUserBlogs()}
                  <p>Contact Form</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="bg-primary pt-4 pb-4 p-4 text-white">
                    Message {user.name}
                  </h5>
                  <br />
                  <p>Contact Form</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

UserProfile.getInitialProps = async ({ query }) => {
  try {
    const data = await userPublicProfile(query.username);
    return { user: data.user, blogs: data.blogs };
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    return { user: null, blogs: [] };
  }
};

export default UserProfile;
