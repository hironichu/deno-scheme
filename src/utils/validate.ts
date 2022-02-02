// deno-types: 'https://deno.land/x/garn_validator/src/index.d.ts'
import { mustBe, isValid,} from "https://deno.land/x/garn_validator/src/index.js";

const schema = {
	protocol: isValid(String, /^[a-zA-Z]+$/),
	command: String, 
	override: mustBe([Boolean, undefined]),
	terminal: mustBe([Boolean, undefined]),
	script: mustBe([Boolean, undefined]),
};

export const validateSchema = (data: Record<string, string | boolean | undefined>): boolean |  Record<string, string | boolean | undefined> => {
	try {
		// mustBe(schema)(data);
		return data
	} catch (e) {
		return false
	}
}
