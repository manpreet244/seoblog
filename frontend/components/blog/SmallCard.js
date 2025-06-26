import Link from "next/link";
import parse from "html-react-parser";
import { API } from "../../config";

// Helper to format relative time
const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return rtf.format(-years, "year");
  if (months > 0) return rtf.format(-months, "month");
  if (days > 0) return rtf.format(-days, "day");
  if (hours > 0) return rtf.format(-hours, "hour");
  if (minutes > 0) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
};

const SmallCard = ({ blog }) => {
  return (
    <div
      className="card border shadow-sm"
      style={{
        maxWidth: "300px",
        borderRadius: "8px",
        overflow: "hidden",
        fontSize: "0.875rem",
      }}
    >
      {/* Image */}
      <Link href={`/blogs/${blog.slug}`} legacyBehavior>
        <a>
          <img
            src={`${API}/blog/photo/${blog.slug}`}
            alt={blog.title}
            style={{
              height: "160px",
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </a>
      </Link>

      {/* Content */}
      <div className="card-body py-2 px-3">
        <Link href={`/blogs/${blog.slug}`} legacyBehavior>
          <a className="text-decoration-none text-dark">
            <h6 className="fw-semibold mb-1" style={{ fontSize: "1rem" }}>
              {blog.title}
            </h6>
          </a>
        </Link>
        <div className="text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
          {parse(blog.excerpt)}
        </div>
        <small className="text-muted d-block mt-2">
           <Link href={`/profile/${blog.postedBy?.userName}`}> ✍️ {' '} <span className="fw-semibold">{blog.postedBy?.userName}</span>
                   {' '} |</Link>{' '} 
                    🗓 {new Date(blog.updatedAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default SmallCard;
