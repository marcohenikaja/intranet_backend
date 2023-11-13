const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://dsi-03:3000',
        'http://172.16.1.92:3000',
        'http://localhost:3000',
        'http://intranet.npakadin.mg' , // Ajoutez cette origine
        'http://intranet.npakadin.mg:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: '*',
};


app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));



const routes = require('./routes/userRoute');
const db = require('./db/db');

db.sequelize.sync().then(() => {
    console.log('DB connected');
}).catch((err) => {
    console.log(err);
});

app.use('/', routes);

app.listen(8000, '0.0.0.0', () => {
    console.log('Serveur started port 8000');
});
