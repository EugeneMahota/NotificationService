module.exports = {
    appPort: 3000,
    mongoUrl: 'mongodb://localhost:27017/notification-service',
    jwt: {
        secret: 'Anacondaz',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '3m'
            }
        }
    }
};