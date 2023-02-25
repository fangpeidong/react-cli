import React, { Suspense, lazy } from 'react';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
const Home = lazy(() => import(/* webpackChunkName: 'Home' */ './pages/Home'));
const About = lazy(() =>
  import(/* webpackChunkName: 'About' */ './pages/About')
);

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <div>
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
        </div>
        <Suspense fallback={<div>loading...</div>}>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
