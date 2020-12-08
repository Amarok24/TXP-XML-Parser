import { XmlNode } from "./XmlNode.ts";

export { NodeDetails };


class NodeDetails
{
	public static Display(node: XmlNode)
	{
		const nodeHasChildren = node.children !== null;
		const nodeHasAttributes = node.attributes !== null;
		console.log("--------------------");
		console.log(`Node id: ${node.id}`);
		console.log(`Name: ${node.name}`);
		console.log(`Text content: ${node.content}`);
		console.log(`\nNode has children? ${nodeHasChildren}`);

		if (nodeHasChildren)
		{
			console.log("Listing children:");
			for (let i = 0; i < node.children!.length; i++)
			{
				console.log(`Child index ${i}`);
			}
		}

		console.log(`\nNode has attributes? ${nodeHasAttributes}`);

		if (nodeHasAttributes)
		{
			console.log("Listing attributes:");
			for (let i = 0; i < node.attributes!.length; i++)
			{
				console.log(`Attribute index ${i}, name "${node.attributes![i][0]}", value "${node.attributes![i][1]}"`);
			}
		}
	}
}
