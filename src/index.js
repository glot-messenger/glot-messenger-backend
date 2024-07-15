const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
   res.send('Express + backend TypeScript. Messenger GLOT.');
});

app.listen(port, () => {
   console.log(`[SERVER]: SERVER STARTED http://localhost:${port}`);
});
