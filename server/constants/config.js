const corsOptions = {
    origin: process.env.CLIENT_URL,
    // origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

module.exports = { corsOptions }