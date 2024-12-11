import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Chat from './components/chat/chat';
import Home from "./components/home/Home";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/service'>
            <Route path="/service/chat" element={<Chat />} />
          </Route>
          <Route path='*' element ={<Navigate to ='/' />} />
        </Routes>
    </Router>
  );
}

export default App;
