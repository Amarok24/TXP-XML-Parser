class TextFileReader {
    data = "";
    constructor(filePathOrUrl){
        this.filePathOrUrl = filePathOrUrl;
    }
    Fetch() {
        let success = false;
        this.data = Deno.readTextFileSync(this.filePathOrUrl);
        if (this.data) success = true;
        return success;
    }
}
class XmlNode {
    children = null;
    attributes = null;
    static counterForId = 0;
    constructor(parent, name, content1, attributes1){
        this.name = name;
        this.parent = parent;
        this.content = content1;
        this.attributes = attributes1;
        this.id = XmlNode.GetNewId();
    }
    static GetNewId() {
        return XmlNode.counterForId++;
    }
}
class XmlTree {
    _nodeCounter = 0;
    get nodeCounter() {
        return this._nodeCounter;
    }
    constructor(rootNode){
        this.rootNode = rootNode;
        this.nodePointer = this.rootNode;
    }
    CreateChild(ofParent, nodeName, content, attributes) {
        const newNode = new XmlNode(ofParent, nodeName, content, attributes);
        newNode.parent = ofParent;
        if (!ofParent.children) {
            ofParent.children = [
                newNode
            ];
        } else {
            ofParent.children.push(newNode);
        }
        this._nodeCounter++;
        this.nodePointer = newNode;
        return newNode;
    }
    GoToRoot() {
        this.nodePointer = this.rootNode;
    }
    GoToChild(index) {
        this.nodePointer = this.nodePointer.children[index];
    }
    GoToParent() {
        if (this.nodePointer.parent !== null) {
            this.nodePointer = this.nodePointer.parent;
        } else {
            throw new Error("error 0, parent is null.");
        }
    }
    GetCurrentNode() {
        return this.nodePointer;
    }
}
class XmlStringMethods {
    static ExtractNodeName(s) {
        let r = new RegExp(/[\w-:]+/);
        let match = r.exec(s);
        if (match !== null) {
            return match[0];
        }
        throw new Error("ExtractNodeName failed.");
    }
    static ExtractAttributes(s) {
        let r = new RegExp(/([\w-:]+)="([\S\s]*?)"/g);
        let arr = [];
        let matches = [
            ...s.matchAll(r)
        ];
        if (matches.length === 0) {
            return null;
        }
        for (const match of matches){
            arr.push([
                match[1],
                match[2]
            ]);
        }
        return arr;
    }
    static RemoveCDataWrapper(input) {
        const re = new RegExp(/^<!\[CDATA\[([\s\S]*)]]>$/);
        const result = input.trim().match(re);
        if (result !== null) {
            return result[1];
        }
        return input;
    }
}
class XmlReader {
    constructor(xmlString){
        this.xmlString = xmlString;
        this.tree = new XmlTree(new XmlNode(null, "[superroot]", "[tree superroot]", null));
    }
    GetIndexOfMainRoot() {
        const javascriptBomString = "\uFEFF";
        let i = 0;
        if (this.xmlString.startsWith(javascriptBomString)) {
            console.log("Info: XML string contains Unicode BOM.");
        }
        for(i = 0; i < this.xmlString.length; i++){
            if (this.xmlString[i] === "<") {
                if (this.xmlString[i + 1] === "?") continue;
                break;
            }
        }
        console.log("Start index is", i);
        return i;
    }
    GetNextElement(startIndex) {
        let nodeBoundary = {
            nodeStartIndex: 0,
            nodeEndIndex: 0,
            nodeText: "",
            textBefore: ""
        };
        let i = 0;
        for(i = startIndex; i < this.xmlString.length; i++){
            if (this.xmlString[i] === "<") {
                if (this.xmlString[i + 1] === "!") {
                    nodeBoundary.textBefore += this.xmlString[i];
                    while(true){
                        i++;
                        if (this.xmlString[i] === "]") {
                            if (this.xmlString.substr(i, 3) === "]]>") {
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
            } else {
                nodeBoundary.textBefore += this.xmlString[i];
            }
        }
        if (i === this.xmlString.length) {
            return nodeBoundary;
        }
        for(i = nodeBoundary.nodeStartIndex + 1; i < this.xmlString.length; i++){
            if (this.xmlString[i] === ">") {
                nodeBoundary.nodeEndIndex = i;
                break;
            } else {
                nodeBoundary.nodeText += this.xmlString[i];
            }
        }
        nodeBoundary.textBefore = XmlStringMethods.RemoveCDataWrapper(nodeBoundary.textBefore);
        nodeBoundary.textBefore = nodeBoundary.textBefore.trim();
        return nodeBoundary;
    }
    DisposeRootNode() {
        this.tree.GoToRoot();
        this.tree.GoToChild(0);
        this.tree.rootNode = this.tree.nodePointer;
        this.tree.rootNode.parent = null;
    }
    Parse() {
        let xmlWalkthroughIndex = 0;
        let nodeString = null;
        let nodeName = "";
        let attributes2;
        const cStyleRed = "color:red";
        xmlWalkthroughIndex = this.GetIndexOfMainRoot();
        try {
            while(true){
                nodeString = this.GetNextElement(xmlWalkthroughIndex);
                if (nodeString.nodeText === "") {
                    break;
                }
                xmlWalkthroughIndex = nodeString.nodeEndIndex + 1;
                nodeName = XmlStringMethods.ExtractNodeName(nodeString.nodeText);
                if (nodeString.textBefore !== "") {
                    this.tree.nodePointer.content = nodeString.textBefore;
                }
                if (nodeString.nodeText.endsWith("/")) {
                    attributes2 = XmlStringMethods.ExtractAttributes(nodeString.nodeText);
                    this.tree.CreateChild(this.tree.nodePointer, nodeName, "", attributes2);
                    this.tree.GoToParent();
                } else if (!nodeString.nodeText.startsWith("/")) {
                    attributes2 = XmlStringMethods.ExtractAttributes(nodeString.nodeText);
                    this.tree.CreateChild(this.tree.nodePointer, nodeName, "", attributes2);
                } else {
                    this.tree.GoToParent();
                }
            }
            this.DisposeRootNode();
            return true;
        } catch (error) {
            console.error("%cXmlReader: Parse error.", cStyleRed);
            return false;
        }
    }
    DemoLoad() {
        console.log("Building XML tree manually...");
        this.tree.CreateChild(this.tree.nodePointer, "Company", "", null);
        this.tree.CreateChild(this.tree.nodePointer, "Name", "Some Company Name", [
            [
                "Type",
                "SomeCompanyType"
            ]
        ]);
        this.tree.GoToParent();
        this.tree.CreateChild(this.tree.nodePointer, "Employees", "345", [
            [
                "Freelancers",
                "54"
            ],
            [
                "FixedContract",
                "282"
            ]
        ]);
        try {
            this.tree.GoToParent();
            this.tree.CreateChild(this.tree.nodePointer, "PreviousName", "Starter Company 123", [
                [
                    "Established",
                    "2012"
                ]
            ]);
        } catch (error) {
            console.error(error);
        }
    }
}
class XmlNodeDetails {
    static Display(node) {
        const nodeHasChildren = node.children !== null;
        const nodeHasAttributes = node.attributes !== null;
        const cStyleGold = "color:gold";
        const cStyleCyan = "color:cyan";
        const cStyleLime = "color:lime";
        console.log("--------------------");
        console.log(`Node ID: ${node.id}`);
        console.log(`%cName: <${node.name}>`, cStyleCyan);
        console.log(`Text content: %c${node.content}`, cStyleCyan);
        if (nodeHasAttributes) {
            console.log("Listing attributes:");
            for(let i = 0; i < node.attributes.length; i++){
                console.log(`%cindex ${i} : name="${node.attributes[i][0]}", value="${node.attributes[i][1]}"`, cStyleLime);
            }
        }
        if (nodeHasChildren) {
            console.log("Listing children:");
            for(let i = 0; i < node.children.length; i++){
                console.log(`%cindex ${i} : <${node.children[i].name}>`, cStyleGold);
            }
        }
    }
}
class XmlTreeInteractive {
    static Start(treeReference) {
        const cStyleBlue = "background-color:steelblue;color:white";
        const cStyleRed = "background-color:darkred;color:white";
        console.log("%cEntering interactive mode", cStyleBlue);
        treeReference.GoToRoot();
        prompt("Current position: root node. Press ENTER to start...");
        while(true){
            console.clear();
            XmlNodeDetails.Display(treeReference.nodePointer);
            let answer = prompt("\nType in child index or 'p' for parent or 'x' for exit:", "x");
            if (answer === "p") {
                try {
                    console.log("%cGoing to parent", cStyleBlue);
                    treeReference.GoToParent();
                } catch (error) {
                    console.log("%cNo parent, this is the root node.", cStyleRed);
                    prompt("Press ENTER to continue...");
                }
            } else if (answer === "x") {
                break;
            } else {
                const selectedChildIndex = parseInt(answer);
                console.log(`%cGoing to child index ${selectedChildIndex}`, cStyleBlue);
                treeReference.GoToChild(selectedChildIndex);
            }
        }
        console.log("End of interactive mode.");
    }
}
const offlineFile = "bbc-news.rss";
let textFileReader = new TextFileReader(offlineFile);
const readSuccess = textFileReader.Fetch();
if (!readSuccess) {
    throw new Error("TextFileReader error");
} else {
    console.log("TextFileReader OK");
}
let xmlStructure = new XmlReader(textFileReader.data);
if (xmlStructure.Parse()) {
    console.log(`XML tree has ${xmlStructure.tree.nodeCounter} nodes.`);
    XmlTreeInteractive.Start(xmlStructure.tree);
}
