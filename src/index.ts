import { os, currentOS } from "./deps.ts"
import { linux, windows } from './platforms.ts'
import constants from './constants.ts';

const { homedir } = constants; 

try {
	Deno.statSync(homedir);
} catch  {
	Deno.mkdirSync(homedir);
}

const getplatform =  () => {
	if (currentOS === "windows") return windows;
	if (currentOS === "linux" ) return linux;
	// if (os.platform() === constants.platforms.macos) return darwin;
	throw new Error('Unknown OS');
};

const platform = getplatform();

const ProtocolRegistry = {
	register: platform.register
}
export default ProtocolRegistry
