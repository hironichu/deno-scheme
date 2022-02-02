import { $ } from "https://deno.land/x/garn_exec@0.3.3/exec.js";

try {
	console.log(`Asking for permission to install...`);
	const res = await $`sudo -u testuser -s /bin/bash -c "sudo echo 'test'"`;
	//Wait until the sudo prompt resovled otherwise return false
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 500);
	});
	console.info(res.stdout)
} catch (e) {
	if (e.code && e.stderr) {
		console.error(`Install error ${e.stderr}`);
	}
	Deno.exit(1);
}

// console.log(res)