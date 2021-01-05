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


const offlineFile = "sample.xml";
//const offlineFile = "jobs_truncated.xml";
//const offlineFile = "jobrequest.xml";

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

	// FOR AN INTERACTIVE DEMO UNCOMMENT THIS:
	XmlTreeInteractive.Start(xmlStructure.tree);
//FIXME: /JobBatch/Job/Company/Department   TEXT MISSING!!!

/*
	let myQuery = new XmlQuery(xmlStructure.tree);

	try
	{
		myQuery.ByXPath("/JobBatch/Job/Company/Name");
		//myQuery.ResultToString();
	} catch (error)
	{
		console.error(error);
	}
	finally
	{
		myQuery.ResultToString();
	}
 */

}
