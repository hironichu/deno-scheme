import { os, path, currentOS } from "../deps.ts"
import constants from '../constants.ts';
const { homedir, platforms} = constants;

const batchScriptContent = `@echo off
`;


const subtituteCommand = (command: string, url: string) => {
	const identifier = '$_URL_';
	return command.split(identifier).join(`"${url}"`);
};

const subtituteWindowsCommand = (command: string) => {
	let identifier = '"$_URL_"';
	command = command
		.split(identifier)
		.join(`"${
				constants.urlArgument.get(platforms.get(currentOS)! + 'InScript')
			}"`
		);
	// eslint-disable-next-line quotes
	identifier = "'$_URL_'";
	command = command
		.split(identifier)
		.join(
			`'${
				constants.urlArgument.get(platforms.get(currentOS)! +'InScript')
			}'`
		);
	return subtituteCommand(
		command,
		constants.urlArgument.get(platforms.get(currentOS)!)!
	);
};

const getWrapperScriptContent = (command: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		try {
			if (currentOS === "windows") {
				return resolve(
					batchScriptContent + subtituteWindowsCommand(command)
				);
			}
			resolve(`#!/usr/bin/env bash
			_URL_=$1
			${command}`)
			return;
		} catch (e) {
			reject(e as string);
		}
	});
};

const saveWrapperScript = (protocol: string, content: string) => {
	const wrapperScriptPath = path.join(
		homedir,
		`./${protocol}Wrapper.${
			currentOS === 'windows' ? 'bat' : 'sh'
		}`
	);
	Deno.writeTextFileSync(wrapperScriptPath, content);
	return wrapperScriptPath;
};

export const deleteWrapperScript = (protocol: string) => {
	const wrapperScriptPath = path.join(
		homedir,
		`./${protocol}Wrapper.${
			(currentOS === 'windows') ? 'bat' : 'sh'
		}`
	);
	console.log(`Deleting wrapper script at ${wrapperScriptPath}`);
	//Check if wrapperScriptPath exist
	// console.log(Deno.lstatSync(wrapperScriptPath))
	// const test = Deno.lstatSync(wrapperScriptPath)
	try {
		Deno.lstatSync(wrapperScriptPath)
		// Deno.removeSync(wrapperScriptPath);
		// if (Deno.lstatSync(wrapperScriptPath).isFile) {
		// }
	} catch {
		console.log("ok");
	}
};

const handleWrapperScript = async (protocol: string, command: string): Promise<string> => {
	const contents = await getWrapperScriptContent(command);
	const scriptPath = saveWrapperScript(protocol, contents);
	if (currentOS !== "windows") {
		await Deno.chmod(scriptPath, 0o755);
		return `'${scriptPath}' '${constants.urlArgument.get(constants.platforms.get(currentOS)!)}'`;
	}
	return `${scriptPath} ${constants.urlArgument.get(constants.platforms.get(currentOS)!)}`;
};

export default handleWrapperScript