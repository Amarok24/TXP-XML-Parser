// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { KeyAndValue } from "./XmlNode.ts";
export { XmlStringMethods };


class XmlStringMethods
{
	public static ExtractNodeName(s: string): string
	{
		let r = new RegExp(/[\w-:]+/); // Matches also namespaces.
		let match = r.exec(s);
		if (match !== null)
		{
			return match[0];
		}

		throw new Error("ExtractNodeName failed.");
	}

	public static ExtractAttributes(s: string): KeyAndValue[] | null
	{
		let r = new RegExp(/([\w-:]+)="([\S\s]*?)"/g); // Matches also namespaces.
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

	/**
	 * Checks if input string contains a CDATA wrapper and removes it (if found).
	 * A string "trim" will be performed before check.
	 * @param input String which may contain a CDATA section that will be removed.
	 * @returns Input string without CDATA section.
	 */
	public static RemoveCDataWrapper(input: string): string
	{
		const re = new RegExp(/^<!\[CDATA\[([\s\S]*)]]>$/);
		const result: string[] | null = input.trim().match(re);

		if (result !== null)
		{
			return result[1];
		}

		return input;
	}
}
