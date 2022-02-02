// const child = require('child_process');
// const constants = require('../config/constants');
import { os } from '../deps.ts'
import { $ } from "https://deno.land/x/garn_exec@0.3.3/exec.js";

const checkIfXDGInstalled = async () => {
	try {
		await $('xdg-mime --version');
		return true;
	} catch {
		return false;
	}
};

const installXdgUtils = async () => {
	try {
		try {
			console.log(`Asking for permission to install...`);
			await $`sudo apt-get update -y && sudo apt install xdg-utils`;
			//Wait until the sudo prompt resovled otherwise return false
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 500);
			});
			console.log(`Successfully installed xdg-utils.`);
		} catch (e) {
			if (e.code && e.stderr) {
				console.error(`Install error ${e.stderr}`);
			}
			Deno.exit(1);
		}
	} catch (e) {
		console.info('Error installing xdg-utils');
		console.info('Please install it manually : apt install xdg-utils');
		Deno.exit(1);
	}
};

export const linuxpostCheck = async () => {
	if (os.platform() === "linux" && !checkIfXDGInstalled()) {
		console.log('\nXDG utils not installed, do you want to install it now? (Sudo will not be prompted) (y/n)');
		const answer = prompt('y/n');
		if (answer === 'y') {
			await installXdgUtils();
		} else {
			console.log('\nPlease install xdg-utils manually');
			Deno.exit(1)
		}
	}
}