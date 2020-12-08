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
}

// TODO: attribute extraction

	/*


		const str = 'Mozilla';

		console.log(str.substring(1, 3));  2nd param: The index of the first character to exclude from the returned substring.
		// expected output: "oz"
	 */
