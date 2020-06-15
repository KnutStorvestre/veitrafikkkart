import React, {Component} from "react";
import {Link} from "react-router-dom";
import dayjs from "dayjs";

//MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import relativeTime from "dayjs/plugin/relativeTime";
//import withStyles from "@material-ui/core/styles/withStyles";
import green from '@material-ui/core/colors/green';

const styles:any = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200,
        maxWidth:200,
        maxHeight: 20,
        paddingTop: '30.25%'
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
};

class Scream extends Component<any, any>{
    render () {
        dayjs.extend(relativeTime);
        const {
            //TODO: not in use
            //const {classes} = this.props;
            scream: {
                body,
                createdAt,
                userImage,
                userHandle,
                screamId,
                likeCount,
                commentCount,
                location,
            }} = this.props;

        console.log(userImage);
        return (
            <Card style={styles.card}>
                <CardMedia
                    image={userImage}
                    title={"Profile image"}
                    style={styles.image}
                />
                <CardContent style={styles.content}>
                    <Typography variant={"h5"} component={Link} to={`/users/${userHandle}`}color={"primary"}>{userHandle}</Typography>
                    <Typography variant={"body2"} color={'textSecondary'}>{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant={"subtitle1"} color={"secondary"}>{"Beskrivelse:"}</Typography>
                    <Typography variant={"body1"}>{body}</Typography>
                    <Typography variant={"subtitle1"} color={"secondary"}>{"Lokasjon:"}</Typography>
                    <Typography variant={"body1"}>{location}</Typography>
                </CardContent>
            </Card>
        )
    }

}

export default Scream;