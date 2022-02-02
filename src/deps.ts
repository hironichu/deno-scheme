import {Registry} from '../../winreg-deno/mod.ts'
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import * as path from "https://deno.land/std@0.118.0/path/mod.ts";
import { isWsl } from "https://raw.githubusercontent.com/denorg/is-wsl/master/mod.ts";
export { $ } from "https://deno.land/x/garn_exec@0.3.3/exec.js";

const wslState = await isWsl();
const currentOS: string = wslState ? 'windows' : os.platform()
export {
	  os,
	  path,
	  Registry,
	  wslState,
	  currentOS
}