// @ts-check

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.listen(9774, function(err) {
    if (err) throw err;
    else {
        console.log('server started on port 9774');
    }
});

app.get('/video', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (res.writable) {
        res.download(path.resolve(__dirname, './assets/firework.mp4'));
    }
});

app.get('/danmaku', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (res.writable) {
        res.download(path.resolve(__dirname, './assets/firework.xml'));
    }
});
