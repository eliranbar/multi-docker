import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPages from './OtherPages';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        <Link to='/'>Home</Link>
        <Link to='/otherpage'>Other page</Link>
        </header>
        
      </div>
      <div>
        <Route exact path='/' component={Fib}></Route>
        <Route exact path='otherpage' component={OtherPages}></Route>
      </div>
    </Router>

  );
}

export default App;