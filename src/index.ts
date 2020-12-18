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

//FIXME: CDATA
/*
Node ID: 35
Name: <Description>
Text content: ]]>
Listing children:
index 0 = <br>
index 1 = <p>
index 2 = <ul>
index 3 = <br>
index 4 = <p>
index 5 = <ul>
index 6 = <br>
index 7 = <p>
index 8 = <ul>
index 9 = <br>
index 10 = <p>
index 11 = <p>
index 12 = <p>
index 13 = <strong>
index 14 = <p>
*/
