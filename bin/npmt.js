#! /usr/bin/env node
const spawn = require('child_process').spawn;
const fileUtils = require('./file-utils');
const utils = require('./utils');
let countdown;
process.argv.splice(0, 2);

const stats = fileUtils.readStats();
const start = Date.now();
const install = spawn('npm', process.argv, {stdio: 'inherit'});

install.on('close', code => {
	const time = Date.now() - start;
	const newAvg = (stats.averageTime * stats.installCount + time) / (stats.installCount + 1);
	stats.averageTime = newAvg;
	stats.installCount++;
	fileUtils.writeStats(stats);
  if (countdown) {
    process.kill(-countdown.pid);
  }
});

if(fileUtils.isHasStats()) {
	let seconds = Math.floor(stats.averageTime / 1000);
	const min = utils.zeroPad(Math.floor(seconds / 60), 2);
	seconds = utils.zeroPad(seconds - min * 60, 2);
	countdown = spawn('./bin/countdown.sh', [`00:${min}:${seconds}`], {stdio: 'inherit', detached: true});

} else {
	console.log('No npm stats yet. wait for next time ;)')
}
