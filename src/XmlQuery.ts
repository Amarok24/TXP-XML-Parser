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
	public currentResult: XmlNode[] = [];
	private linkedTree: XmlTree;

	constructor(tree: XmlTree)
	{
		this.linkedTree = tree;
	}

	/**
	 * Under construction.
	 * @param path Just very basic support planned, no complicated XPath queries.
	 */
	public ByXPath(path: string)
	{
		let pathArray = path.split("/");
		console.dir(pathArray);

		this.linkedTree.GoToRoot();
		this.linkedTree.GoToChild(0);
		this.currentResult.push(this.linkedTree.GetCurrentNode());
	}

	public ResultToString(): string
	{
		console.dir(this.currentResult);
		return "";
	}
}


// GetElementById: string | null
// GetElementsByTagName: XmlNodeList  (can be returned empty)
