import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import authContext from "../../utility/authContext";
import server from "../../utility/serverConfig";

function Dashboard() {
  const { isAuthenticated, setIsAuthenticated } = useContext(authContext);

  async function logout(e) {
    e.preventDefault();
    try {
      await server.get("/auth/logout", { withCredentials: true });
    } catch (err) {
      console.log(err);
    }
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
  }

  return (
    <>
      <nav className="navbar">
        <ul>
          <li>
            <Link to={"/"}>Mehfil</Link>
          </li>
          <li>
            <Link to={"/guftgu"}>Guftgu</Link>
          </li>
        </ul>
            <button className="logoutBtn" onClick={logout}>Logout</button>
      </nav>
      <Outlet />
    </>
  );
}

export default Dashboard;
