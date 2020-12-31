// Copyright 2020 Jan Prazak
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

import { XmlNodeDetails } from "./XmlNodeDetails.ts";
import { XmlTree } from "./XmlTree.ts";
export { XmlTreeInteractive };

/**
 * Interactive traversal of the tree. Control through user input in console. No error checks. Mainly for testing / demo purposes.
 */
class XmlTreeInteractive
{
	public static Start(treeReference: XmlTree): void
	{
		const cStyleBlue = "background-color:steelblue;color:white";
		const cStyleRed = "background-color:darkred;color:white";
		console.log("%cEntering interactive mode", cStyleBlue);

		treeReference.GoToRoot();
		prompt("Current position: root node. Press ENTER to start...");

		while (true)
		{
			console.clear();
			XmlNodeDetails.Display(treeReference.nodePointer);
			let answer: string = prompt("\nType in child index or 'p' for parent or 'x' for exit:", "x")!;

			if (answer === "p")
			{
				try
				{
					console.log("%cGoing to parent", cStyleBlue);
					treeReference.GoToParent();
				}
				catch (error)
				{
					console.log("%cNo parent, this is the root node.", cStyleRed);
					prompt("Press ENTER to continue...");
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
				treeReference.GoToChild(selectedChildIndex);
			}
		}

		console.log("End of interactive mode.");
	}

}
