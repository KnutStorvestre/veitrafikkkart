import React, {Component} from "react";
import AppIcon from '../images/icon2.png';
import axios from 'axios';
//MUI stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";

//TODO make global so that you have it in both signup and login without writing it twice
const styles: any = {
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
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10,
    },
    progress: {
        position: 'absolute'
    }
};

class signUp extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: '',
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (event: any) => {
        //hides parts of url
        event.preventDefault();
        this.setState({
            loading: true
        })
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        }
        axios.post('/signup', newUserData)
            .then((res: any) => {
                console.log(res.data);
                localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch((err: any) => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }

    handleChange = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const {classes} = this.props;
        const {errors, loading} = this.state;
        return (
            //<Grid container className={classes.from}>
            <Grid container style={styles.form}>
                <Grid item sm/>
                <Grid item sm>
                    <img src={AppIcon} alt={"monkey"} style={styles.image}/>
                    <Typography variant={"h2"} style={styles.pageTitle}>
                        Signup
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id={"email"} name={"email"} type={"email"} label={"Email"} style={styles.textField}
                                   helperText={errors.email} error={errors.email ? true : false}
                                   value={this.state.email} onChange={this.handleChange} fullWidth/>
                        <TextField id={"password"} name={"password"} type={"password"} label={"Password"}
                                   style={styles.textField}
                                   helperText={errors.password} error={errors.password ? true : false}
                                   value={this.state.password} onChange={this.handleChange} fullWidth/>
                        <TextField id={"confirmPassword"} name={"confirmPassword"} type={"password"}
                                   label={"Confirm Password"}
                                   style={styles.textField}
                                   helperText={errors.confirmPassword} error={errors.confirmPassword ? true : false}
                                   value={this.state.confirmPassword} onChange={this.handleChange} fullWidth/>
                        <TextField id={"handle"} name={"handle"} type={"text"} label={"Handle"}
                                   style={styles.textField}
                                   helperText={errors.handle} error={errors.handle ? true : false}
                                   value={this.state.handle} onChange={this.handleChange} fullWidth/>
                        {errors.general && (
                            <Typography variant={"body2"} style={styles.customError}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button type={"submit"} variant={"contained"} color={"primary"} style={styles.button}
                                disabled={loading}>
                            Signup
                            {loading && (
                                <CircularProgress size={30} style={styles.progress}/>
                            )}
                        </Button>
                        <br/>
                        <small>Already have an account? Sign in <Link to={"/login"}>here</Link></small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        )
    }
}

//TODO CircularProgress left for the login

//TODO
//export default withStyles(useStyles)(login);
export default signUp;

//<Grid container style={{textAlign: 'center'}}>
//export default withStyles(styles)(login);

/* kansje ikke nødvnebdig i ts
login.PropTypes = {
    classes: PropTypes.object.isRequired
}
 */