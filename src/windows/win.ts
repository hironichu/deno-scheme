import { Registry } from '../deps.ts'
import  preProcessCommands from'../utils/cmd.ts';
import { validateSchema } from '../utils/validate.ts';
import { RegisterOptions } from '../types/platform.d.ts';
import { deleteWrapperScript} from '../utils/wrapperScript.ts'
import { assertEquals, assert } from "https://deno.land/std@0.117.0/testing/asserts.ts"



async function register( params: RegisterOptions ): Promise<boolean>  {
	const validate = validateSchema(params)
	if (typeof validate === 'boolean') throw new Error('Invalid options')
	
	const { protocol, override , script,terminal } = params
	let { command } = params
	const registry = new Registry({
		hive: Registry.HKCU,
		key: '\\Software\\Classes\\' + protocol
	});
	const exist =  await registry.keyExists()
	if (exist) {
		if (!override) throw new Error('Protocol already exists');
		// await new Promise(() =>
		const state = await registry.destroy()
		if (!state) throw new Error('Failed to delete the key')
		// )
	}
	command = await preProcessCommands(protocol, command, script!);
	const res = await registry.create()
	if (!res) throw new Error('Failed to create registry key')
	const keyPath = '\\Software\\Classes\\' + protocol
	const urlDecl = 'URL: ' + protocol + ' Protocol';
	const cmdPath = keyPath + '\\shell\\open\\command';

	const commandRegistry = new Registry({
		hive: Registry.HKCU,
		key: cmdPath
	});
	// console.log(command)
	const RegKeys = await Promise.all([
		registry.set(
			'URL Protocol',
			Registry.REG_SZ,
			Registry.DEFAULT_VALUE
		),
		registry.set(
			Registry.DEFAULT_VALUE,
			Registry.REG_SZ,
			urlDecl,
		),
		commandRegistry.set(
			Registry.DEFAULT_VALUE,
			Registry.REG_SZ,
			terminal ? `cmd /k ${command}` : `${command}`,
		)
	])

	const checkKeys = RegKeys.every((value) => value === true)
	if (!checkKeys) {
		await registry.destroy()
		deleteWrapperScript(protocol)
		throw new Error('Failed to create registry key')
	}
	console.debug(`[DenoScheme] Done. | ${protocol}:// is now registered.`);
	return true
}

const windows = {
	register
}

export default windows