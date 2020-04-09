import React, {Component} from "react";
import Grid from "@material-ui/core/Grid/Grid";

class home extends Component<any, any> {

    render() {
        return (
            //spacing is meant to be 16, but crashes if it's over 10
            <Grid container spacing={9}>
                <Grid item sm={8} xs={12}>
                    <p>Content...</p>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile</p>
                </Grid>
            </Grid>
        )
    }
}

export default home;