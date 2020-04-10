import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import home from "./pages/home";
import signUp from "./pages/signUp";
import login from "./pages/login";
import Navbar from "./components/Navbar";
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff'
        },
        secondary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#ff'
        }
        /*,
        typography: {
            useNextVariants: true
        }
         */
    }
});

class App extends Component<any, any> {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
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
            </MuiThemeProvider>
        );
    }
}

export default App;
