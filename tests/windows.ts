// import { RegisterOptions } from "..";
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

// console.log(res)