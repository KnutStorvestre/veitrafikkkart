import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode';
//Pages
import home from "./pages/home";
import signUp from "./pages/signUp";
import login from "./pages/login";
import map from "./pages/map";
//Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute"
//MUI
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
//import themeFile from './util/theme';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ffb74d',
            main: '#ff9800',
            dark: '#f57c00',
            contrastText: '#fff'
        }

        /*,
        typography: {
            useNextVariants: true
        }
         */
    }
});

// const theme = createMUITheme(themeFile);

/*
let authenticated:boolean;
const token = localStorage.FBIdToken;
if (token){
    const decodedToken:any = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()){
        window.location.href = '/login';
        authenticated = false;
    }
    else
        authenticated = true;
}
*/

//let authenticated = false;

function isAuthenticated() {
    let authenticated:boolean;
    const token = localStorage.FBIdToken;
    if (token){
        const decodedToken:any = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()){
            window.location.href = '/login';
            return false;
        }
        return true;
    }
}

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
                                <AuthRoute exact path="/login" component={login} /*authenticated={isAuthenticated()}*//>
                                <AuthRoute exact path="/signup" component={signUp} /*authenticated={isAuthenticated()}*//>
                                <AuthRoute exact path="/map" component={map} /*authenticated={isAuthenticated()}*//>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;

/*
<AuthRoute exact path="/login" component={login} authenticated={authenticated}/>
<AuthRoute exact path="/signup" component={signUp} authenticated={authenticated}/>
 */