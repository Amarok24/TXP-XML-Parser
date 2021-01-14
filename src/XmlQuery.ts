// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { XmlNode } from "./XmlNode.ts";
import { XmlTree } from "./XmlTree.ts";
export { XmlQuery };


class XmlQuery
{
	public currentResults: string[] = [];
	//public currentResults: XmlNode[] = [];
	private linkedTree: XmlTree;

	constructor(tree: XmlTree)
	{
		this.linkedTree = tree;
	}

	/**
	 * Filters whole XML by XPath query.
	 * @param path Just very basic support of XPath strings.
	 */
	public ByXPath(path: string)
	{
		let pathArray: string[] = path.split("/");

		// Usually 'path' starts with '/', but this leads to empty index 0, so remove it.
		if (pathArray[0] === "") pathArray.shift(); // Removes 1st element.

		console.dir(pathArray);
		console.log(`name of current node: ${this.linkedTree.nodePointer.name}`);

		this.TreeBrowser(pathArray, 1);
	}


	public ResultToString(): string
	{
		console.dir(this.currentResults);
		return "";
	}


	private TreeBrowser(pathArray: string[], processIndex: number): void
	{
		const currentNode: XmlNode = this.linkedTree.GetCurrentNode();
		const childCount = currentNode.children ? currentNode.children.length : -1;

		//console.log(`processIndex = ${processIndex} (${pathArray[processIndex]}) | currentNode.name = "${currentNode.name}" | childCount = "${childCount}"`);

		if (processIndex === pathArray.length)
		{
			console.log(`node "${currentNode.name}" found! going to parent`);
			this.currentResults.push(currentNode.content);
		}
		else
		{
			for (let i = 0; i < childCount; i++)
			{
				// Because current node may change outside of this loop, we have to
				// always keep an up-to-date reference to it (complex recursion is crazy).
				const currentNodeNow: XmlNode = this.linkedTree.GetCurrentNode();
				//console.log(`i = ${i}, currentNodeNow.name = "${currentNodeNow.name}"`);

				// Below the '!' is necessary because of TypeScript
				if (currentNodeNow.children![i].name === pathArray[processIndex])
				{
					//console.log(`found "${pathArray[processIndex]}" at child index ${i}, GoToChild(${i}) ...`);

					this.linkedTree.GoToChild(i);

					//console.log(`recursively diving in, TreeBrowser with processIndex = ${processIndex + 1} (${pathArray[processIndex + 1]}) ...`);
					this.TreeBrowser(pathArray, processIndex + 1);
				}

				//console.log(`ending 1 iteration of FOR loop, currentNodeNow.name = "${currentNodeNow.name}"`);
				//console.log(`processIndex = ${processIndex}`);
			}
		}

		try
		{
			this.linkedTree.GoToParent();
		}
		catch (error)
		{
			if (error.message.startsWith("error 0"))
			{
				console.log("Root node reached, no parent available.");
			}
			else
			{
				console.error(error);
			}
		}

		//console.log(`exiting TreeBrowser method, linkedTree.GetCurrentNode().name = ${this.linkedTree.GetCurrentNode().name}`);
	}

}
