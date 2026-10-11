import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        DayNotes <span>✿</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/write">Write Journal</Link>
        <Link to="/memories">My Memories</Link>
      </div>
    </nav>
  );
}

export default Navbar;