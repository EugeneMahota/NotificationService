module.exports = {
    baseHref: 'http://localhost:3000',
    appPort: 3000,
    mongoUrl: 'mongodb://localhost:27017/notification-service',
    jwt: {
        secret: 'Anacondaz',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '1000m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '100000m'
            }
        }
    },
    corsOptions: {
        origin: 'http://localhost:4200',
        optionsSuccessStatus: 200,
        methods: "GET,PUT,POST,DELETE",
        allowedHeaders: ['Content-Type', 'application/json', 'Accept', 'multipart/form-data', 'Authorization']
    }
};