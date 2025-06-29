import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="row">
            <div className="col-md-12" style={{ paddingBottom: '1rem' }}>
              <h2 style={{ color: '#c634eb', fontWeight: '600' }}>User Dashboard</h2>
            </div>

            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/user/crud/blog" passHref>
                    <span
                      style={{
                        color: '#312a33',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      ✍️ Create Blog
                    </span>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/user/crud/blogs" passHref>
                    <span
                      style={{
                        color: '#312a33',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🗂 Update/Delete Blog
                    </span>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/user/update" passHref>
                    <span
                      style={{
                        color: '#312a33',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      ⚙️ Update Profile
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-8">
              <div
                style={{
                  border: '1px dashed #ccc',
                  borderRadius: '6px',
                  padding: '1rem',
                  backgroundColor: '#f9f9fb',
                  color: '#312a33'
                }}
              >
                <p style={{ fontStyle: 'italic' }}>
                  User-specific info or stats can appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
