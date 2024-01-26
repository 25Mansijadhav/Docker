// server.js

const express = require('express');
const fs = require('fs');
const readline = require('readline');

const app = express();
const port = 8080;

app.get('/data', (req, res) => {
    const fileName = req.query.n;
    const lineNumber = req.query.m;

    if (!fileName) {
        return res.status(400).send('File name (n) is required.');
    }

    const filePath = `/tmp/data/${fileName}.txt`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found.');
    }

    if (lineNumber) {
        // Read specific line from the file
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        let currentLine = 0;

        rl.on('line', (line) => {
            currentLine++;
            if (currentLine == lineNumber) {
                rl.close();
                res.send(line);
            }
        });

        rl.on('close', () => {
            res.status(404).send('Line not found.');
        });
    } else {
        // Read entire file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Internal Server Error.');
            }
            res.send(data);
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
