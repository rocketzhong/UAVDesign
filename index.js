const express = require('express');
const router = require('./serialCom')
const app = express();
app.use('/', router)
const port = 8080
app.listen(port, () => {
    console.log(`端口开启: http://localhost:${port}`)
});