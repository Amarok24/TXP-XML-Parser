// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { XmlNode } from "./XmlNode.ts";

export { NodeDetails };


class NodeDetails
{
	public static Display(node: XmlNode)
	{
		const nodeHasChildren = node.children !== null;
		const nodeHasAttributes = node.attributes !== null;
		const cStyleGold = "color:gold";
		const cStyleCyan = "color:cyan";
		const cStyleGreen = "color:green";
		console.log("--------------------");
		console.log(`Node ID: ${node.id}`);
		console.log(`%cName: <${node.name}>`, cStyleCyan);
		console.log(`Text content: ${node.content}`);

		//console.log(`\nNode has attributes? ${nodeHasAttributes}`);

		if (nodeHasAttributes)
		{
			console.log("Listing attributes:");
			for (let i = 0; i < node.attributes!.length; i++)
			{
				console.log(`%cindex ${i}, name="${node.attributes![i][0]}", value="${node.attributes![i][1]}"`, cStyleGreen);
			}
		}

		//console.log(`\nNode has children? ${nodeHasChildren}`);
		if (nodeHasChildren)
		{
			console.log("Listing children:");
			for (let i = 0; i < node.children!.length; i++)
			{
				console.log(`%cindex ${i} = <${node.children![i].name}>`, cStyleGold);
			}
		}

	}
}
