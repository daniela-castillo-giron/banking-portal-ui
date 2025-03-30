const environment = {
    production: process.env.NODE_ENV || 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8180/api',
    tokenName: process.env.REACT_APP_TOKEN_NAME || 'authToken',
    origin: process.env.REACT_APP_ORIGIN || 'http://localhost:4200',
};

export default environment;
