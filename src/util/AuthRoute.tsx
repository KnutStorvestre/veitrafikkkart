import React from "react";
import { Route, Redirect} from "react-router-dom";

interface IProps {
        authenticated: boolean,
        component: any
        exact:boolean,
        path:string
}

interface Interface {

}

const AuthRoute = ({component: Component, authenticated, ...rest}:any) => (
    <Route
        {...rest}
        render={(props:any) => authenticated === true ? <Redirect to='/'/> : <Component {...rest} />
        }
        />
);

export default AuthRoute;