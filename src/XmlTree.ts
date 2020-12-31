// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { XmlNode } from "./XmlNode.ts";
import type { KeyAndValue } from "./XmlNode.ts";
export { XmlTree };


class XmlTree
{
	public rootNode: XmlNode;

	/**
	 * Property nodePointer changes its XmlNode reference dynamically. It always points to current node which has been processed via a class method.
	 */
	public nodePointer: XmlNode;
	private _nodeCounter: number = 0;

	public get nodeCounter(): number
	{
		return this._nodeCounter;
	}

	constructor(rootNode: XmlNode)
	{
		this.rootNode = rootNode;
		this.nodePointer = this.rootNode;
	}


	public CreateChild(ofParent: XmlNode, nodeName: string, content: string, attributes: KeyAndValue[] | null): XmlNode
	{
		const newNode = new XmlNode(ofParent, nodeName, content, attributes);
		newNode.parent = ofParent;

		if (!ofParent.children)
		{
			ofParent.children = [newNode];
		}
		else
		{
			ofParent.children.push(newNode);
		}

		this._nodeCounter++;

		this.nodePointer = newNode;
		return newNode;
	}


	public GoToRoot(): void
	{
		this.nodePointer = this.rootNode;
	}


	public GoToChild(index: number): void
	{
		// Assumes the child with given index exists! No check here. //TODO: check??
		this.nodePointer = this.nodePointer.children![index];
	}


	public GoToParent(): void
	{
		if (this.nodePointer.parent !== null)
		{
			this.nodePointer = this.nodePointer.parent;
		}
		else
		{
			throw new Error("error 0, parent is null.");
		}
	}


	public GetCurrentNode(): XmlNode
	{
		return this.nodePointer;
	}
}
