const express = require('express');
const app = express();
app.get('/', (req: Request, res: any) => {
    res.send('Hello world!');
})
const port = 8080
app.listen(port, () => {
    console.log(`端口开启: http://localhost:${port}`)
});