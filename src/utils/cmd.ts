import constants from '../constants.ts'
import { os, wslState, currentOS} from '../deps.ts'
import handleWrapperScript  from './wrapperScript.ts'
const { urlArgument, platforms} = constants;


const subtituteCommand = (command: string, url: string) => {
	const identifier = '$_URL_';
	return command.split(identifier).join(`'${url}'`);
}

const preProcessCommands = async (protocol: string, command:string, scriptRequired:boolean) => {
	if (!scriptRequired) return subtituteCommand(command, urlArgument.get(platforms.get(currentOS)!)!);
	const newCommand = await handleWrapperScript(protocol, command);
	return newCommand;
}

export default preProcessCommands