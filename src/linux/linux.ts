
import { $ } from "https://deno.land/x/garn_exec@0.3.3/exec.js";
import * as path from 'https://deno.land/std@0.117.0/path/mod.ts'
import  preProcessCommands from'../utils/cmd.ts';
import { validateSchema } from '../utils/validate.ts';
import { RegisterOptions } from '../types/platform.d.ts';
import {linuxpostCheck} from './postcheck.ts'
import {default as constants} from '../constants.ts'
// import { deleteWrapperScript} from '../utils/wrapperScript.ts'

/**
 * Checks if the given protocal already exist on not
 * @param {string=} protocol - Protocol on which is required to be checked.
 * @returns {Promise}
 */
const checkifExists = async (protocol: string): Promise<boolean> => {
	const res = await $`xdg-mime query default x-scheme-handler/${protocol}`
	console.error(`Output debug: ${res.stdout}`)
	if (res.code !== 0 || res.stderr) {
		return false
	}
	if (res.stdout && res.stdout.length > 0) {
		return true
	}
	return false
};

/**
 * Registers the given protocol with the given command.
 * @param {object} options - the options
 * @param {string=} options.protocol - Protocol on which it the given command should be called.
 * @param {string=} options.command - Command which will be executed when the above protocol is initiated
 * @param {boolean=} options.override - Command which will be executed when the above protocol is initiated
 * @param {boolean=} options.terminal - If set true then your command will open in new terminal
 * @param {boolean=} options.script - If set true then your commands will be saved in a script and that script will be executed
 * @param {function (err)} cb - callback function Optional
 */

const register = async (params: RegisterOptions): Promise<boolean> => {
	await linuxpostCheck()
	const validate = validateSchema(params)
	if (typeof validate === 'boolean') throw new Error('Invalid options')
	
	const { protocol, override , script, terminal } = params
	let { command } = params

	try {
		const exist = await checkifExists(protocol);
		if (exist) {
			if (!override) throw new Error('Protocol already exists');
		}

		const desktopFileName = `${protocol}.desktop`;
		const desktopFilePath = path.join(constants.homedir, desktopFileName);
		const scriptFilePath = path.join(constants.homedir, 'script.sh');

		command = await preProcessCommands(protocol, command, script!);
		try {
			await $`mkdir -p ${constants.homedir}/.local/share/applications`
		} catch (e) {
			console.error(`Error, could not create ~/.local/share/applications/`, e.stderr)
			Deno.exit(1)
		}
		const desktopFileContent = `[Desktop Entry]
Type=Application
Name=URL ${ protocol }
Exec=${ command }
StartupNotify=false
Terminal=${terminal  ? 'true' : 'false' }
MimeType=x-scheme-handler/${protocol};`
		Deno.writeFileSync(desktopFilePath, new TextEncoder().encode(desktopFileContent));

		const scriptContent = `
set -e;
mv '${desktopFilePath}'  ~/.local/share/applications/
cd ~/.local/share/applications
xdg-mime default ${desktopFileName} x-scheme-handler/${protocol}`;
		Deno.writeFileSync(scriptFilePath, new TextEncoder().encode(scriptContent));
		Deno.chmodSync(scriptFilePath, 0o755);
		//Deno execute the script
		const scriptResult = await $`${scriptFilePath}`

		if (scriptResult.code != 0 || scriptResult.stderr)
			throw new Error(scriptResult.stderr);

		Deno.removeSync(scriptFilePath);
		console.log(`Registered ${protocol}://`)
		return true
	} catch (e) {
		console.error(`Error while registering ` ,e)
		return false
	}
};

export default {
	register
};