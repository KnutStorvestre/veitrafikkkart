import React, {Component} from "react";
import {Link} from "react-router-dom";
//Don't do this imports entire library makes compile time slower. Do tree shaking instead.
//aka only importing what you need
//import {AppBar,Toolbar} from "@material-ui/core";
// MUI stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

class Navbar extends Component<any, any> {
    render() {
        return (
            <AppBar>
                <Toolbar className={"nav-container"}>
                    <Button color="inherit" component={Link} to={"/login"}>Login</Button>
                    <Button color="inherit" component={Link} to={"/"}>Home</Button>
                    <Button color="inherit" component={Link} to={"/signup"}>Signup</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navbar