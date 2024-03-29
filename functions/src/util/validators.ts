
const isEmail = (email:any) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx))
        return true;
    else
        return false;
};

const isEmpty = (string:any) => {
    if (string.trim() === '')
        return true;
    else
        return false;
};

exports.validateSignupData = (data:any) => {
    let errors: {[k: string]: any} = {};

    if (isEmpty(data.email))
        errors.email = 'Must not be empty';
    if (isEmail(data.password))
        errors.password = 'Must not be empty';

    if (isEmpty(data.password))
        errors.password = 'Must not be empty';
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = 'Passwords must match';
    if (isEmpty(data.handle))
        errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
};

exports.validateLoginData = (data:any) => {
    let errors: {[k: string]: any} = {};

    if (isEmpty(data.email))
        errors.email = 'Must not be empty';
    if (isEmpty(data.password))
        errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
};

exports.reduceUserDetails = (data:any) => {

    interface IuserDetails{
        bio: string,
        website: string
        location: string
    }

    let userDetails:IuserDetails = {bio:"s",website:"s",location:"s"};

    if (!isEmpty(data.bio.trim()))
        userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
        if (data.website.trim().substr(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        }
        else
            userDetails.website = data.website;
    }
    if (!isEmpty(data.location.trim()))
        userDetails.location = data.location;
    return userDetails;
};