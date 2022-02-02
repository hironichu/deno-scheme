import { path, currentOS, wslState, Registry} from "../src/deps.ts"

const getHomedir = async () => {

	if (currentOS === "windows") {
		if (wslState){
			const reg = new Registry({
				hive: Registry.HKCU,
				key: '\\Volatile Environment',
				utf8: true,
			});
			const homeDrive = await reg.get('HOMEDRIVE') ;
			const homeDir = await reg.get('HOMEPATH') ;
			if (typeof homeDrive !== 'boolean' && typeof homeDir !== 'boolean') {
				const home = path.join('/mnt',homeDrive.value.substring(0, 1).toLowerCase(), homeDir.value.replace(/\\/g, '/').substring(0, 1).toLowerCase(), homeDir.value.replace(/\\/g, '/').substring(1).toLowerCase());
				return home
			}
			throw new Error('Could not get the home directory')
		} else {
			if (Deno.env.get("USERPROFILE") !== undefined) {
				return Deno.env.get("USERPROFILE")!
			}
			throw new Error("USERPROFILE is undefined")
		}
	}
	return Deno.env.get("HOME")!;
}
console.log(await getHomedir())