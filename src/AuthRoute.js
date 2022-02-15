import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  if (localStorage.getItem('user') !== null) {
    return <Outlet />
  }
  return <Navigate to={"/login"} replace />;
};

export function authHeader() {
  // return authorization header with basic auth credentials
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.authdata) {
      return { 'Authorization': 'Basic ' + user.authdata };
  } else {
      return {};
  }
}