export { XmlNode };
export type { KeyAndValue };


type KeyAndValue = [string, string];


class XmlNode
{
	public name: string; // Optional XML namespace will be part of name.
	public parent: XmlNode | null;
	public children: XmlNode[] | null = null;
	public attributes: KeyAndValue[] | null = null;
	public content: string;
	public id: number;
	protected static counterForId = 0;

	constructor(parent: XmlNode | null, name: string, content: string, attributes: KeyAndValue[] | null)
	{
		this.name = name;
		this.parent = parent;
		this.content = content;
		this.attributes = attributes;
		this.id = XmlNode.GetNewId();
	}

	private static GetNewId(): number
	{
		return XmlNode.counterForId++;
	}
}
