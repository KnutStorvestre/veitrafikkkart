
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
    if (isEmpty(data.password))
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