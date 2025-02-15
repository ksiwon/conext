import React from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Tester from './pages/Tester';
import Home from './pages/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignupStudent from './pages/SignupStudent';
import LoginStudent from './pages/LoginStudent';
import SignupTeacher from './pages/SignupTeacher';
import LoginTeacher from './pages/LoginTeacher';
import Mypage from './pages/Mypage';
import FindStudent from './pages/FindStudent';
import FindTeacher from './pages/FindTeacher';
import OtherpageTeacher from './pages/OtherpageTeacher';
import OtherpageStudent from './pages/OtherpageStudent';
import Chat from './pages/Chat';
import FindGroup from './pages/FindGroup';
import Grouppage from './pages/Grouppage';
import Mygroup from './pages/Mygroup';
import CreateGroup from './pages/CreateGroup';


function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Routes>
            {/* 라우트 설정 */}
            <Route path="/" element={<Home />} />
            <Route path="/search/teacher" element={<FindStudent />} />
            <Route path="/search/student" element={<FindTeacher />} />
            <Route path="/search/teacher/:id" element={<OtherpageTeacher />} />
            <Route path="/search/student/:id" element={<OtherpageStudent />} />
           
            <Route path="/chat/:id" element={<Chat />} />

            <Route path="/search/group" element={<FindGroup />} />
            <Route path="/search/group/:id" element={<Grouppage />} />
            <Route path="/mygroup" element={<Mygroup />} />
            <Route path="/mygroup/create" element={<CreateGroup />} />

            <Route path="/signup/student" element={<SignupStudent />} />
            <Route path="/login/student" element={<LoginStudent />} />
            <Route path="/signup/teacher" element={<SignupTeacher />} />
            <Route path="/login/teacher" element={<LoginTeacher />} />

            <Route path="/mypage" element={<Mypage />} />

            <Route path="/tester" element={<Tester />} />
            <Route path="*" element={<div>잘못된 접근입니다.</div>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;