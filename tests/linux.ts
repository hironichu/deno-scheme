import {path} from "../src/deps.ts";

import ProtocolRegistry from "../src/index.ts";

const tmpProtocolName = `deno-${Date.now()}`;
//Check if deno test is used

// console.info(`
// Registering protocols: ${tmpProtocolName}
// ---
//   [o] - Override
//   [o-s] - Override with script
//   [o-s-t] - Override with script and terminal
// ---
// `);


Deno.test("Registering new URL Default", async () => {
	await ProtocolRegistry.register({
		protocol: tmpProtocolName,
		command: `deno run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")}`
	});
})


Deno.test("Registering new URL [o]", async () => {
	await ProtocolRegistry.register({
		protocol: tmpProtocolName,
		command: `deno run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")}`,
		override: true,
	});
	//Check fi the protocol is registered by executing it
	// const url = `${tmpProtocolName}://`;
	// const response = await fetch(url);
	// const text = await response.text();
	// console.log(text);
})

Deno.test("Registering new URL [o-s]", async () => {
	await ProtocolRegistry.register({
		protocol: tmpProtocolName,
		command: `deno run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")}`,
		override: true,
		script: true
	});
	//Check fi the protocol is registered by executing it
	// const url = `${tmpProtocolName}://defaultarg`;
	// const response = await fetch(url);
	// const text = await response.text();
	// console.log(text);
})

Deno.test("Registering new URL [o-s-t]", async () => {
	await ProtocolRegistry.register({
		protocol: tmpProtocolName,
		command: `deno run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")}`,
		override: true,
		script: true,
		terminal: true
	});
	//Check fi the protocol is registered by executing it
	const url = `${tmpProtocolName}://defaultarg`;
	const response = await fetch(url);
	const text = await response.text();
	console.log(text);
})

