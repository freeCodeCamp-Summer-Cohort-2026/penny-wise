import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar grid grid-cols-3 p-4">

      <Link to="/" className="col-span-1 text-left">Home</Link>
      {/* <Link to="/dashboard" className="text-xl font-bold col-span-1">Penny Wise</Link> */}
      <h2 className="text-xl font-bold col-span-1">Penny Wise</h2>
      <div className="auth-links flex gap-4 col-span-1 justify-end">
        <Link to="/profile">Profile</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    </nav>
  );
}
