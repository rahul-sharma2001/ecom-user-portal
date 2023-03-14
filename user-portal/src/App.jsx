import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Login from './components/organisms/Login';
import Signup from './components/organisms/Signup';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
    </Routes>
    </BrowserRouter>
  
  );
}

export default App;