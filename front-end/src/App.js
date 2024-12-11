import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Chat from './components/chat/chat';
import Home from "./components/home/Home";
import { Login} from "./components/auth/login";
import { Register} from "./components/auth/register";
import { PublicRoute} from './components/auth/PublicRoute';
import { JournalDetail } from './components/dailyJournal/JournalDetail'
import { JournalList } from './components/dailyJournal/JournalList'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/login' element ={<PublicRoute> <Login /> </PublicRoute>} />
          <Route path='/signup' element ={<PublicRoute> <Register /> </PublicRoute>} />
          
          <Route path='/service'>
            <Route path="/service/chat" element={<Chat />} />
            
            <Route path='/service/journal' element ={<JournalList/> } />
            <Route path='/service/journal/:todoId' element ={<JournalDetail/> } />
          </Route>
          <Route path='*' element ={<Navigate to ='/' />} />
        </Routes>
    </Router>
    
  );
}

export default App;
