import { XmlNode } from "./XmlNode.ts";
import { XmlTree } from "./XmlTree.ts";
import { StringMethods } from "./StringMethods.ts";
import { NodeDetails } from "./NodeDetails.ts";

export { XmlParser };


interface INodeBoundary
{
	nodeStartIndex: number;
	nodeEndIndex: number;
	nodeText: string;
	textBefore: string;
}


class XmlParser
{
	private readonly xmlString: string;
	private tree: XmlTree;

	public get NodeCount()
	{
		return this.tree.nodeCounter;
	}

	constructor(xmlString: string)
	{
		this.xmlString = xmlString;
		this.tree = new XmlTree(
			new XmlNode(null, "[superroot]", "[tree superroot]", null)
		);
	}


	/**
	 * @description Interactive traversal of the tree. Control through user input in console. No error checks at the moment. Mainly for testing purposes.
	 */
	public Interactive(): void
	{
		const cStyleBlue = "background-color:steelblue;color:white";
		const cStyleRed = "background-color:darkred;color:white";
		console.log("%cEntering interactive mode", cStyleBlue);

		this.tree.GoToRoot();
		console.log("Current position: root node. Let's begin...");

		while (true)
		{
			NodeDetails.Display(this.tree.nodePointer);
			let answer: string = prompt("\nType in child index or 'p' for parent or 'x' for exit:", "x")!;

			if (answer === "p")
			{
				try
				{
					console.log("%cGoing to parent", cStyleBlue);
					this.tree.GoToParent();
				}
				catch (error)
				{
					console.log("%cNo parent, this is the root node.", cStyleRed);
				}
			}
			else if (answer === "x")
			{
				break;
			}
			else
			{
				const selectedChildIndex = parseInt(answer);

				console.log(`%cGoing to child index ${selectedChildIndex}`, cStyleBlue);
				this.tree.GoToChild(selectedChildIndex);
			}
		}

		console.log("End of interactive mode.");
	}


	private GetNextElement(startIndex: number): INodeBoundary
	{
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
				{
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

		try
		{
			while (true)
			{
				nodeString = this.GetNextElement(xmlWalkthroughIndex);

				if (nodeString.nodeText === "")
				{
					console.log("nodeString.nodeText empty");
					break;
				}

				xmlWalkthroughIndex = nodeString.nodeEndIndex + 1;

				nodeName = StringMethods.ExtractNodeName(nodeString.nodeText);

				//console.log(`nodeName: "${nodeName}"`);
				//console.log(`textBefore: "${nodeString.textBefore}"`);

				if (nodeString.textBefore !== "")
				{
					this.tree.nodePointer.content = nodeString.textBefore;
				}

				if (nodeString.nodeText.endsWith("/"))
				{	// If node is a self-closing node.
					//console.log("ends with /");
					this.tree.CreateChild(this.tree.nodePointer, nodeName, "", null);
					this.tree.GoToParent();

				}
				else if (!nodeString.nodeText.startsWith("/"))
				{	// If node is NOT a closing node but an opening node.
					//console.log("starts with /");
					this.tree.CreateChild(this.tree.nodePointer, nodeName, "", null);

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
			console.error("XmlParser: Parse error.");
			return false;
		}

		// TODO: CDATA section support
		/*
			<![CDATA[   text text  ]]>
		*/
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
