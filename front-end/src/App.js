import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Chat from './components/chat/chat';
import Home from "./components/home/Home";
import { Login} from "./components/auth/login";
import { Register} from "./components/auth/register";
import { PublicRoute} from './components/auth/PublicRoute';
import { JournalDetail } from './components/dailyJournal/JournalDetail'
import { JournalList } from './components/dailyJournal/JournalList'
import { AuthConsumer, AuthProvider } from "./context/JWTAuthContext";
import { Flex, Spinner } from "@chakra-ui/react";
import { Authenticated } from "./components/auth/Authenticated";
import { HomeNavBar } from './components/navbar/HomeNavBar';
import ChatDetail from "./components/chat/ChatDetails";

function App() {
  return (
    <>
    <AuthProvider>
    <Router>
      <AuthConsumer>
        {(auth)=> !auth.isInitialized? (
          <Flex height = '100vh' alignItems = 'center' justifyContent = 'center'>
            <Spinner thickness='4px' speed='0.5s' emptyColor='brand.200' color="brand.500" />
          </Flex>
        ): (
          <Routes>
            <Route path="/" element={<PublicRoute><HomeNavBar/><Home/></PublicRoute>} />
            <Route path='/login' element ={<PublicRoute> <Login /> </PublicRoute>} />
            <Route path='/register' element ={<PublicRoute> <Register/> </PublicRoute>} />
            <Route path='/service'>
              <Route path="/service/home" element={<Authenticated><Home/></Authenticated>} />
              <Route path="/service/chat" element={<Authenticated><Chat /></Authenticated>} />
              <Route path="/service/chat/:sessionId" element={<Authenticated><ChatDetail /></Authenticated>} />
              <Route path='/service/journal' element ={<Authenticated><JournalList/></Authenticated> } />
              <Route path='/service/journal/:JournalId' element ={<Authenticated><JournalDetail/></Authenticated> } />
          </Route>
            <Route path='*' element ={<Navigate to ='/' />} />
        </Routes>
        )}
      </AuthConsumer>
    </Router>
    </AuthProvider>
    </>
  );
}

export default App;
