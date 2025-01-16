import './App.css';
import { BrowserRouter } from 'react-router-dom'
import Router from "./components/Router";
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
