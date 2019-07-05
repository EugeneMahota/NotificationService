module.exports = parseData = (response) => {
    try {
        if(response._id) {
            return {status: 'Ok', msg: ''}
        } else {
            return {status: 'Error', msg: 'Что то пошло не так!'}
        }
    } catch (err) {
        return {status: 'Error', msg: err.message}
    }
};

