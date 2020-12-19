// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

export { XmlNode };
export type { KeyAndValue };


type KeyAndValue = [string, string];


class XmlNode
{
	public name: string; // Optional XML namespace will be part of name.
	public parent: XmlNode | null;
	public children: XmlNode[] | null = null;
	public attributes: KeyAndValue[] | null = null;
	public content: string; // Text content of node.
	public id: number; // Internal unique ID, gets incremented with each new node.
	protected static counterForId = 0;

	constructor(parent: XmlNode | null, name: string, content: string, attributes: KeyAndValue[] | null)
	{
		this.name = name;
		this.parent = parent;
		this.content = content;
		this.attributes = attributes;
		this.id = XmlNode.GetNewId();
	}

	private static GetNewId(): number
	{
		return XmlNode.counterForId++;
	}
}
