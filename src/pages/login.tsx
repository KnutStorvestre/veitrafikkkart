import React, {Component} from "react";
import AppIcon from '../images/icon.png';
//import axios from 'axios';

//MUI stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";


const styles:any = {
    form: {
        textAlign: 'center',
    },
    image: {
        margin: '20px auto 20px auto',
    },
    pageTitle: {
        margin: '10px auto 10px auto',
    },
    textField: {
        margin: '10px auto 10px auto',
    },
    button: {
        marginTop: 20,
    },
}

class login extends Component<any, any>{

    constructor(props:any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            errors: {}
        }
    }

    //hides parts of url
    handleSubmit = (event:any) => {
        event.preventDefault();
        this.setState({
            loading: true
        })
        //axios.post()
    }

    handleChange = (event:any) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const { classes } = this.props;
        return(
            //<Grid container className={classes.from}>
            <Grid container style={styles.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt={"monkey"} style={styles.image}/>
                    <Typography variant={"h2"} style={styles.pageTitle}>
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id={"email"} name={"email"} type={"email"} label={"email"} style={styles.textField}
                                   value={this.state.email} onChange={this.handleChange} fullWidth />
                        <TextField id={"password"} name={"password"} type={"password"} label={"Password"} style={styles.textField}
                                   value={this.state.password} onChange={this.handleChange} fullWidth />
                        <Button type={"submit"} variant={"contained"} color={"primary"} style={styles.button}>
                            Login
                        </Button>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

//export default withStyles(useStyles)(login);
export default login;

//<Grid container style={{textAlign: 'center'}}>
//export default withStyles(styles)(login);

/* kansje ikke nødvnebdig i ts
login.PropTypes = {
    classes: PropTypes.object.isRequired
}
 */