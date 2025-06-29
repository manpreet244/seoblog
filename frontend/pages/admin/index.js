import Link from "next/link";
import Admin from "../../components/auth/Admin";
import Layout from "../../components/Layout";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="row">
            <div className="col-md-12" style={{ paddingBottom: '1rem' }}>
              <h2 style={{ color: '#c634eb', fontWeight: '700' }}>Admin Dashboard</h2>
            </div>

            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag" passHref>
                    <span style={{ color: '#312a33', textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      ➕ Create Category
                    </span>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag" passHref>
                    <span style={{ color: '#312a33', textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      🏷️ Create Tag
                    </span>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/admin/crud/blog" passHref>
                    <span style={{ color: '#312a33', textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      ✍️ Create Blog
                    </span>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="/admin/crud/blogs" passHref>
                    <span style={{ color: '#312a33', textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      🗑️ Update/Delete Blog
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-8">
              <div
                style={{
                  background: '#f9f9fb',
                  border: '1px dashed #ccc',
                  borderRadius: '6px',
                  padding: '1rem',
                  color: '#312a33'
                }}
              >
                <p style={{ fontStyle: 'italic' }}>Admin-specific content goes here.</p>
              </div>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
