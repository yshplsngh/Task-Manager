import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Layout from './utils/Layout';
import ProtectedRoute from './utils/ProtectedRoute'
import Dashboard from './pages/Dashboard';

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
            </Route>
            
            <Route path={'*'} element={<NotFound />} />
            <Route path={'/error'} element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}


