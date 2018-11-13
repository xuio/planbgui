const commands = [
	['ping', ['8.8.4.4']],
	['ping', ['8.8.8.8']],
];

const express = require('express');
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { spawn } = require('child_process');

const state = [false, false];

const process = [null, null];


app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/frontend/index.html`);
});

io.on('connection', (socket) => {
	console.log('client connected');

	socket.on('button', (msg) => {
		switch(msg){
		case 'on1':
			console.log('on1');
			process[0] = spawn(...commands[0]);
			process[0].stdout.on('data', (data) => {
				socket.emit('process1', data.toString());
			});
			break;
		case 'off1':
			process[0].kill('SIGINT');
			console.log('off1');
			break;
		case 'on2':
			process[1] = spawn(...commands[1]);
			process[1].stdout.on('data', (data) => {
				io.emit('process2', data.toString());
			});
			console.log('on2');
			break;
		case 'off2':
			process[1].kill('SIGINT');
			console.log('off2');
			break;
		}
	});

	socket.on('disconnect', () => {
		console.log('client disconnected');
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
