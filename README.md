# Deno-Scheme

Deno-Scheme is a module that allows you to create a custom URL scheme for your project.

> FIY - This is a work in progress.


## Notice
This module is a work in progress.
it may in some case break or not work as expected.

I am not responsible for any damage caused by this module. (if any!)
>Mac is not currently supported, this module is a work in progress and may break, be careful using it
## Usage

```ts
//On Windows

import {path} from "../src/deps.ts";

import ProtocolRegistry from "../src/index.ts";

console.log("Registering...");
const res = await ProtocolRegistry.register({
	protocol: "denoapp",
	command: `C:\\Users\\zenze\\.deno\\bin\\deno.exe run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")} $_URL_`,
	override: true,
	terminal: true,
	script: true,
})

##On linux 
	await ProtocolRegistry.register({
		protocol: tmpProtocolName,
		command: `deno run -A --unstable ${path.join(Deno.cwd(), "/tests/denoapp.ts")}`,
		override: true,
		script: true,
		terminal: true
	});


```



