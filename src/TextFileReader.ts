export { TextFileReader };


class TextFileReader
{
	public readonly onlineUrl: string;
	public data = "";

	constructor(onlineUrl: string)
	{
		this.onlineUrl = onlineUrl;
	}

	// Returns 'true' on success.
	public Fetch(): boolean
	{
		let success = false;

		this.data = Deno.readTextFileSync(this.onlineUrl);
		if (this.data) success = true;

		return success;
	}

}



/*
try {
	fetch(rss)
	.then(function (response) {
	  if (!response.ok) {
		 console.log(response);
		 throw new Error("HTTP error, status = " + response.status);
	  }
	  return response.text();
	})
	.then( function(str) {
	  //let parser = new DOMParser();
	  //xmlObject = parser.parseFromString(str, "text/xml");
	  //console.log(str);
	  console.log("fetch OK!");
	  Deno.writeTextFileSync("out.txt", str);
	  //afterFetch();
	});
} catch (error) {
	console.log("some error");
	console.log(error);
}


*/
