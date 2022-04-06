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
import { MantineProvider } from '@mantine/core';
import PricingPage from './features/pricing/PricingPage';



function App() {
  return (
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: 'main',
          colors: {
            main: [
              "#EFF0FF",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)",
              "rgb(112 121 255)"
            ]
          }
        }}
        emotionOptions={{ key: 'mantine', prepend: false }}
      >
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<LayoutsWithDefaultNavbar />}>
              <Route path="" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/" element={<LayoutsWithDefaultNavbar />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/account" element={<Login />} />
              </Route>

              <Route path="/editor/:id" element={<WithEditorNavbar />}>
                <Route path="" element={<Editor />} />
                <Route path="newLesson" element={<CreateLesson />} />
                <Route path="newTeacher" element={<CreateTeacher />} />
                <Route path="configure" element={<ConfigureEditor />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </MantineProvider>
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
