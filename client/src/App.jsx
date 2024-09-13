import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import NoPage from './pages/NoPage'
import Profil from './pages/Profil';
import MyHome from './pages/MyHome'
import Create from './pages/Create'
import Login from './pages/login'
import Join from './pages/join'
import TakePicture from './pages/TakePicture';
import GoogleCallBack from './pages/GoogleCallBack';
import PrivacyPolicy from './pages/Confidentialite';
import TermsOfUse from './pages/ConditionUtilisation';
import GetToken from './pages/GetToken';

import withAuth from './components/withAuth';

const ProtectedProfil = withAuth(Profil)
const ProtectedMyHome = withAuth(MyHome)
const ProtectedCreate = withAuth(Create)
const ProtectedJoin = withAuth(Join)
const ProtectTakePicture = withAuth(TakePicture)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login/:whereGo' element={<Login />} />
        {/*<Route path='/auth/google/callback' element={<GoogleCallBack/>} />*/}
        <Route path='/profil' element={<ProtectedProfil/>} />
        <Route path='/myHome' element={<ProtectedMyHome/>} />
        <Route path='/takePicture' element={<ProtectTakePicture/>} />
        <Route path='/create' element={<ProtectedCreate />} />
        <Route path='/join' element={<ProtectedJoin/>} />
        <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
        <Route path='/ConditionUtilisation' element={<TermsOfUse/>} />
        <Route path='/GetToken' element={<GetToken/>} />
        <Route path='*' element={<NoPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
