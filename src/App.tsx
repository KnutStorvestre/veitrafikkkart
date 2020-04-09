import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import home from "./pages/home";
import signUp from "./pages/signUp";
import login from "./pages/login";
import Navbar from "./components/Navbar";


function App() {
    return (
        <div className="App">
            <Router>
                <Navbar/>
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={home}/>
                        <Route exact path="/login" component={login}/>
                        <Route exact path="/signup" component={signUp}/>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
