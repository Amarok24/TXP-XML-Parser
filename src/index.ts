/**
  * TXP - Tiny XML Parser written in TypeScript.
  * @author Jan Prazak
  * @website https://github.com/Amarok24/
  * @license Apache-2.0
*/

import { TextFileReader } from "./TextFileReader.ts";
import { XmlReader } from "./XmlReader.ts";
import { XmlTreeInteractive } from "./XmlTreeInteractive.ts";
import { XmlQuery } from "./XmlQuery.ts";

//const offlineFile = "sample.xml";
const offlineFile = "bbc-news.rss";

let textFileReader = new TextFileReader(offlineFile);
const readSuccess = textFileReader.Fetch();

if (!readSuccess)
{
	throw new Error("TextFileReader error");
}
else
{
	console.log("TextFileReader OK");
	// textFileReader.data now contains whole file content as text
}

let xmlStructure = new XmlReader(textFileReader.data);

if (xmlStructure.Parse())
{
	console.log(`XML tree has ${xmlStructure.tree.nodeCounter} nodes.`);

	// FOR AN INTERACTIVE DEMO USE THIS:
	 XmlTreeInteractive.Start(xmlStructure.tree);


	// FOR A QUERY DEMO USE THIS:
/* 
	let myQuery = new XmlQuery(xmlStructure.tree);

	try
	{
		myQuery.ByXPath("/rss/channel/item/title");
	} catch (error)
	{
		console.error(error);
	}
	finally
	{
		console.log("Displaying first 10 results...\n");

		for (let i = 0; i < myQuery.currentResults.length; i++)
		{
			if (i === 11) break;
			console.log(myQuery.currentResults[i]);
		}

		// Or display all results to console with:
		// myQuery.ResultsToConsole();
	}
 */


}
