import React, { ReactNode, useEffect } from 'react';
import Background from '../ui/Background';
import { Toaster } from '../ui/Toaster';
import Header from '../ui/Header';

import { useLocation } from 'react-router-dom';
import { WEB_NAME } from './api';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth < 1030) {
    return (
      <div className="grid min-h-[80vh] place-content-center px-4">
        <h1 className="tracking-widest text-slate-300 text-center text-sm">
          Ops! This application is not available for mobile devices. Please use a desktop or laptop.
        </h1>
        <p className="mt-2 text-center font-thin text-slate-200">{WEB_NAME}</p>
      </div>
    );
  }


  const location = useLocation();
  const omitHeader = ['/login'];
  const pickBG = ['/', '/login'];

  const shouldOmitHeader = () => {
    return omitHeader.some((path) => location.pathname === path);
  };

  return (
    <>
      {/*show bg only for pickBG arrays endpoints*/}
      {pickBG.includes(location.pathname) && <Background />}

      {/*remove header only for omitHeader arrays endpoint*/}
      {!shouldOmitHeader() && <Header />}
      <div
        style={{ position: 'relative', zIndex: 2 }}
        // show black bg for all endpoints other than pickBG arrays one
        className={`${!pickBG.includes(location.pathname) ? 'bg-background-dark' : ''} flex justify-center`}
      >
        <div className={'h-full w-[80rem]'}>{children}</div>
      </div>
      <Toaster richColors closeButton duration={4000} />
    </>
  );
};

export default Layout;
