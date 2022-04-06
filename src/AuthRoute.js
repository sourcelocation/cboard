import { Navigate, Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  console.log(localStorage.getItem('user-token'));
  if (localStorage.getItem('user-token') !== null) {
    return <Outlet />
  }
  return <Navigate to={"/login"} replace />;
};

export function authHeader() {
  let token = localStorage.getItem('user-token');
  if (token) {
      return { 'Authorization': 'Bearer ' + token };
  } else {
      return {};
  }
}