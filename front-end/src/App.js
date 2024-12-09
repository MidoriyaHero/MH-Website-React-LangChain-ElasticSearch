import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from './components/chat/chat';
import { LeftNav } from "./components/navbar/LeftNav";
import Home from "./components/home/Home";

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <LeftNav />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
