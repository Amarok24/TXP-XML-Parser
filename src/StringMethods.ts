import { KeyAndValue } from "./XmlNode.ts";

export { StringMethods };


class StringMethods
{
	public static ExtractNodeName(s: string): string
	{
		let r = new RegExp(/\w+/);
		let match = r.exec(s);
		if (match !== null)
		{
			return match[0];
		}

		throw new Error("ExtractNodeName failed.");
	}

	public static ExtractAttributes(s: string): KeyAndValue[] | null
	{
		let r = new RegExp(/(\w+)="([\S\s]*?)"/g);
		let arr: KeyAndValue[] = [];
		let matches = [...s.matchAll(r)];

		if (matches.length === 0)
		{
			return null;
		}

		for (const match of matches)
		{
			arr.push([match[1], match[2]]);
		}

		return arr;
	}
}

	/*


		const str = 'Mozilla';

		console.log(str.substring(1, 3));  2nd param: The index of the first character to exclude from the returned substring.
		// expected output: "oz"
	 */
