import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Layout from './utils/Layout';
import ProtectedRoute from './utils/ProtectedRoute'
import Dashboard from './pages/dashboard/Dashboard';
import CreateNewTask from './pages/tasklist/CreateNewTask';
import TaskList from './pages/tasklist/TaskList';
import EditTask from './pages/tasklist/EditTask';

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasklist" element={<TaskList />} />
              <Route path="/tasklist/new" element={<CreateNewTask />} />
              <Route path='/tasklist/edit/:taskId' element={<EditTask />} />
            </Route>

            <Route path={'*'} element={<NotFound />} />
            <Route path={'/error'} element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}


