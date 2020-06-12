import React, {Component} from "react";
import Grid from "@material-ui/core/Grid/Grid";
import axios from "axios";

import Scream from "../components/Scream";

interface IState {
    screams: any | undefined
}

class home extends Component<any, any> {

    state:IState = {
        screams: null
    }

    componentDidMount(): void {
        axios.get('/screams')
            .then((res:any) => {
                console.log(res.data)
                this.setState({
                    screams: res.data
                })
            })
            .catch((err:any) => console.log(err));
    }

    render() {
        let recentScreamsMarkup = this.state.screams ? (
            this.state.screams.map((scream:any) => <Scream key={scream.screamId} scream={scream}/>)
        ) : <p>Loading...</p>
        return (
            //spacing is meant to be 16, but crashes if it's over 10
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile</p>
                </Grid>
            </Grid>
        )
    }
}

export default home;