import { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

export default function App(): ReactElement {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              <Route path={'*'} element={<NotFound />} />
              <Route path={'/error'} element={<NotFound />} />
            </Routes>
          </Layout>
        </Routes>
      </Router>
    </Provider>
  );
}


