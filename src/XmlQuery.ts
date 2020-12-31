// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { XmlNode } from "./XmlNode.ts";
import { XmlTree } from "./XmlTree.ts";
export { XmlQuery };

//type XmlNodeList = XmlNode[];

//TODO: This class is under construction, not for production yet.
class XmlQuery
{
	public currentResults: XmlNode[] = [];
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
		if (pathArray[0] === "") pathArray.shift(); // Removes 1st element.
		console.dir(pathArray);

		//this.linkedTree.GoToRoot();
		//this.DisposeRootNode();
		console.log(`name of current node: ${this.linkedTree.nodePointer.name}`);

		this.TreeBrowser(pathArray, 0);

		/*
				for (let i = 0; i < pathArray.length; i++)
				{
		
				}
		*/
		/*
				this.linkedTree.GoToRoot();
				this.linkedTree.GoToChild(0);
				this.currentResults.push(this.linkedTree.GetCurrentNode()); */
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

		//console.log(`processIndex = ${processIndex}`);

		if (processIndex === pathArray.length)
		{
			this.currentResults.push(this.linkedTree.GetCurrentNode());
		}

		// The following FOR-loop will also be skipped if processIndex == pathArray.length
		for (let i = 0; i < childCount; i++)
		{
			console.log(`i = ${i}, currentNode.name = "${currentNode.name}"`);

			if (currentNode.children !== null)
			{ // Check for !== null not necessary here, but TypeScript wants it
				if (currentNode.children[i].name === pathArray[processIndex + 1])
				{
					console.log(`found "${pathArray[processIndex]}" at child index ${i}, diving in...`);

					this.linkedTree.GoToChild(i);
					this.TreeBrowser(pathArray, processIndex + 1);
				}
			}

			console.log(`ending 1 iteration of FOR loop, currentNode.name = "${currentNode.name}"`);
			console.log(`processIndex = ${processIndex}`);
			//this.linkedTree.GoToParent();

		}

		console.log(`exiting TreeBrowser method, currentNode.name = ${currentNode.name}`);
		try
		{
			this.linkedTree.GoToParent();
		} catch (error)
		{
			if (error.message.startsWith("error 0"))
			{
				console.log("no parent available");

			}
		}


	}


}


// GetElementById: string | null
// GetElementsByTagName: XmlNodeList  (can be returned empty)
