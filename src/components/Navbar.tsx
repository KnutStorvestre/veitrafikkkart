import React, {Component} from "react";

// MUI stuff

//Don't do this imports entire library makes compile time slower. Do tree shaking instead
//import {AppBar,Toolbar} from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";


class Navbar extends Component<any, any> {
    render() {
        return(
            <AppBar>
                <Toolbar>
                    <Button color="inherit">Login</Button>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">Signup</Button>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Navbar