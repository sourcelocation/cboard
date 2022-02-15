import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useParams
} from "react-router-dom";
import './App.css';
import { Navbar } from './app/Navbar';
import Editor from './features/editor/Editor';
import { CreateLesson } from './features/editor/creators/CreateLesson';
import { CreateTeacher } from './features/editor/creators/CreateTeacher';
import { ConfigureEditor } from './features/editor/configure/ConfigureEditor';
import Login from './features/login/Login';
import { AuthLayout } from './AuthRoute';
import DashboardPage from './features/dashboard/DashboardPage';
import HomePage from './features/home/HomePage';
import { EditorNavbar } from './features/editor/EditorNavbar';



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LayoutsWithDefaultNavbar />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/account" element={<Login />} />
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/editor/:id" element={<WithEditorNavbar />}>
              <Route path="" element={<Editor />} />
              <Route path="newLesson" element={<CreateLesson />} />
              <Route path="newTeacher" element={<CreateTeacher />} />
              <Route path="configure" element={<ConfigureEditor />} />
            </Route>
          </Route>
          <Route path="/" element={<LayoutsWithDefaultNavbar />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function LayoutsWithDefaultNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
function WithEditorNavbar() {
  return (
    <>
      <EditorNavbar />
      <Outlet />
    </>
  );
}

export default App;
