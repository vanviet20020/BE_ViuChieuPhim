const redis = require('redis');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

client.connect();

client.on('error', (error) => console.log(error));

client.on('connect', () => console.log('Connect redis successfully !!'));

client.on('ready', () => console.log('Redis is ready !!'));

module.exports = client;
