// import { RegisterOptions } from "..";
import {path} from "../src/deps.ts";

import ProtocolRegistry from "../src/index.ts";

console.log("Registering...");
ProtocolRegistry.register({
	protocol: "denotestapp",
	command: `deno.exe run -A --unstable ${path.join(Deno.cwd(), "./denoapp.ts")} $_URL_`,
	override: false,
	terminal: true,
	script: true,
},(err?: Error) => {
	console.log(err || "Registered");
})