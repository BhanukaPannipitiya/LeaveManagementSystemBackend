const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/LMS';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

mongoose.connection.on('connected', () => {
    console.log('Connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

module.exports = mongoose;