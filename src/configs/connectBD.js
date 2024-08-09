const mongoose = require('mongoose');
require('dotenv').config();

// async function connect() {
//     try {
//         await mongoose.connect(process.env.MONGOURL, {
//             useNewUrlParser: true,
//         });
//         console.log('Connect database Successfully !!');
//     } catch (error) {
//         console.log(error);
//     }
// }

/*Típ JS: connct multi DB*/
const newConnect = (uri) => {
    const connect = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    connect.on('error', (error) => console.log(error));

    connect.on('connected', () =>
        console.log('Connect database Successfully !!'),
    );

    connect.on('disconnected', () =>
        console.log('Disconnect database Successfully !!'),
    );

    process.on('SIGINT', async () => {
        await connect.close();
        process.exit(0);
    });

    return connect;
};

const connection = newConnect(process.env.MONGOURI);

module.exports = { connection };
