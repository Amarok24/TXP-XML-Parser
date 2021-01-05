// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { KeyAndValue, XmlNode } from "./XmlNode.ts";
import { XmlTree } from "./XmlTree.ts";
import { XmlStringMethods } from "./XmlStringMethods.ts";
export { XmlReader };


interface INodeBoundary
{
	nodeStartIndex: number;
	nodeEndIndex: number;
	nodeText: string;
	textBefore: string;
}


class XmlReader
{
	private readonly xmlString: string;
	public tree: XmlTree;

	constructor(xmlString: string)
	{
		this.xmlString = xmlString;
		this.tree = new XmlTree(
			new XmlNode(null, "[superroot]", "[tree superroot]", null)
		);
	}

	/**
	 * Makes sure the main XML string processing starts at the right index.
	 * This method skips UTF-16 BOM (if available) and also the <?xml ... ?> header.
	 * @returns Index after UTF-16 BOM and <?xml ... header part.
	 */
	private GetStartIndexOfXml(): number
	{
		const javascriptBomString = "\uFEFF";
		// If UTF-8 textfile contains a BOM (which must be 0xEFBBBF) it will be automatically changed by textfile reader to an UTF-16 BOM in JavaScript string. BOM is then always 0xFEFF (Big-Endian).
		const xmlStart = "<?xml";
		const bomAndXmlStart = javascriptBomString + xmlStart;

		let i: number = 0;

		if (this.xmlString.startsWith(javascriptBomString))
		{
			console.log("XML input file contains Unicode BOM.");
		}

		if ( !(this.xmlString.startsWith("<?xml") || this.xmlString.startsWith(bomAndXmlStart)) )
		{
			return i;
		}

		for (i = 0; i < this.xmlString.length; i++)
		{
			if (this.xmlString[i] === ">")
			{
				break;
			}
		}

		return i + 1;
	}

	/**
	 * 
	 * @param startIndex Index of private xmlString.
	 */
	private GetNextElement(startIndex: number): INodeBoundary
	{
		// FIXME: XML comments break the algorithm
		let nodeBoundary: INodeBoundary = {
			nodeStartIndex: 0,
			nodeEndIndex: 0,
			// 'nodeStartIndex' and 'nodeEndIndex' will mark position of "<" and ">"
			nodeText: "",
			// 'nodeText' can possibly contain "/" at the beginning or end
			textBefore: ""
			// 'textBefore' can be relevant node text content or just some whitespace chars
		};

		let i: number = 0;

		for (i = startIndex; i < this.xmlString.length; i++)
		{
			if (this.xmlString[i] === "<")
			{
				if (this.xmlString[i + 1] === "!")
				{	// "<!" detected, which should be a CDATA section.
					// Now collect all following chars until end of CDATA reached.
					nodeBoundary.textBefore += this.xmlString[i];

					while (true)
					{
						i++;

						if (this.xmlString[i] === "]")
						{
							if (this.xmlString.substr(i, 3) === "]]>")
							{
								nodeBoundary.textBefore += "]]>";
								i += 2;
								break;
							}
						}

						nodeBoundary.textBefore += this.xmlString[i];
					}

					continue;
				}

				nodeBoundary.nodeStartIndex = i;
				break;
			}
			else
			{
				nodeBoundary.textBefore += this.xmlString[i];
			}
		}

		if (i === this.xmlString.length)
		{	// End of xmlString reached and "<" char not found, aborting.
			return nodeBoundary;
		}

		for (i = nodeBoundary.nodeStartIndex + 1; i < this.xmlString.length; i++)
		{
			if (this.xmlString[i] === ">")
			{
				nodeBoundary.nodeEndIndex = i;
				break;
			}
			else
			{
				nodeBoundary.nodeText += this.xmlString[i];
			}
		}

		nodeBoundary.textBefore = XmlStringMethods.RemoveCDataWrapper(nodeBoundary.textBefore);
		nodeBoundary.textBefore = nodeBoundary.textBefore.trim();

		return nodeBoundary;
	}


	private DisposeRootNode()
	{
		this.tree.GoToRoot();
		this.tree.GoToChild(0);
		this.tree.rootNode = this.tree.nodePointer;
		this.tree.rootNode.parent = null;
	}


	public Parse(): boolean
	{
		let xmlWalkthroughIndex: number = 0;
		let nodeString: INodeBoundary | null = null;
		let nodeName: string = "";
		let attributes: KeyAndValue[] | null;
		const cStyleRed = "color:red";

		xmlWalkthroughIndex = this.GetStartIndexOfXml();

		try
		{
			while (true)
			{
				nodeString = this.GetNextElement(xmlWalkthroughIndex);
				//console.log(`nodeString.nodeText = ${nodeString.nodeText}`);

				if (nodeString.nodeText === "")
				{
					break;
				}

				xmlWalkthroughIndex = nodeString.nodeEndIndex + 1;
				nodeName = XmlStringMethods.ExtractNodeName(nodeString.nodeText);

				if (nodeString.textBefore !== "")
				{
					this.tree.nodePointer.content = nodeString.textBefore;
				}

				if (nodeString.nodeText.endsWith("/"))
				{	// If node is a self-closing node.
					attributes = XmlStringMethods.ExtractAttributes(nodeString.nodeText);
					this.tree.CreateChild(this.tree.nodePointer, nodeName, "", attributes);
					this.tree.GoToParent();
				}
				else if (!nodeString.nodeText.startsWith("/"))
				{	// If node is NOT a closing node but an opening node.
					attributes = XmlStringMethods.ExtractAttributes(nodeString.nodeText);
					this.tree.CreateChild(this.tree.nodePointer, nodeName, "", attributes);
				}
				else
				{
					this.tree.GoToParent();
				}
			}
			// Disposes the superroot node which is not needed anymore,
			// and it also fixes the node-count because it started with 0.
			this.DisposeRootNode();

			return true;
		}
		catch (error)
		{
			console.error("%cXmlReader: Parse error.", cStyleRed);
			return false;
		}
	}


	public DemoLoad(): void
	{
		console.log("Building XML tree manually...");

		this.tree.CreateChild(this.tree.nodePointer, "Company", "", null);
		this.tree.CreateChild(this.tree.nodePointer, "Name", "Some Company Name", [["Type", "SomeCompanyType"]]);
		this.tree.GoToParent();
		this.tree.CreateChild(this.tree.nodePointer, "Employees", "345",
			[
				["Freelancers", "54"],
				["FixedContract", "282"]
			]
		);

		try
		{
			this.tree.GoToParent();
			this.tree.CreateChild(this.tree.nodePointer, "PreviousName", "Starter Company 123", [["Established", "2012"]]);
		}
		catch (error)
		{
			console.error(error);
		}
	}



}
