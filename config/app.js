module.exports = {
    baseHref: 'http://localhost:3000',
    appPort: 3000,
    mongoUrl: 'mongodb://localhost:27017/notification-service',
    jwt: {
        secret: 'Anacondaz',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '5000m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '6000m'
            }
        }
    }
};