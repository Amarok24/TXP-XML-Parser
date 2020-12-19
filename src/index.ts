/**
  * TXP - Tiny XML Parser written in TypeScript.
  * @author Jan Prazak
  * @website https://github.com/Amarok24/
  * @license Apache-2.0
*/


import { TextFileReader } from "./TextFileReader.ts";
import { XmlParser } from "./XmlParser.ts";
import { XmlTreeInteractive } from "./XmlTreeInteractive.ts";

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

let parser = new XmlParser(textFileReader.data);

console.log(`XML tree has ${parser.NodeCount} nodes.`);
parser.Parse();
console.log(`XML tree has ${parser.NodeCount} nodes.`);

//parser.Interactive();
XmlTreeInteractive.Start(parser.tree)
