import React, {Component} from "react";

//MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";

const styles = {
    card: {
        display: 'flex'
    }
}

class Scream extends Component<any, any>{
    render () {
        const { classes, scream : {body,createdAt, userImage, userHandle, screamId, likeCount, commentCount} } = this.props
        return (
            <Card>
                <CardMedia
                    image={userImage}
                    title={"Profile image"}/>
                    <CardContent>
                        <Typography variant={"h5"}>{userHandle}</Typography>
                        <Typography variant={"body2"} color={'textSecondary'}>{createdAt}</Typography>
                        <Typography variant={"body1"}>{body}</Typography>
                    </CardContent>
            </Card>
        )
    }

}

export default Scream;