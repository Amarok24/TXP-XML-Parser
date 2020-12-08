/**
  * @description TXP - Tiny XML Parser written in TypeScript.
  * @author Jan Prazak
  * @website https://github.com/Amarok24/
  * @license MIT
*/


import { TextFileReader } from "./TextFileReader.ts";
import { XmlParser } from "./XmlParser.ts";

const offlineFile = "sample.xml";
//const offlineFile = "jobs_truncated.xml";

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

parser.Interactive();


/*

let testXml = `  	<Company>
<Name>AnotherCompany</Name>
<Description />
<Department>Deutsche AG</Department>
<Address>
	<City>Berlin</City>
	<PostalCode>12345</PostalCode>

	We have some address!
</Address>
</Company>`;

 */


//let parser = new XmlParser(testXml);
