import express from "express";
import fs from "fs";   
const app = express();
app.use(express.json());
const port = 3000;  

app.get('/', (req, res) => {
 fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading index.html');
    }
    else {
    res.send(data);
}
 });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});