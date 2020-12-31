# TXP XML-Parser

### A fast and tiny XML parser.

This is a back-end project (command line).

Class "TextFileReader" makes use of Deno runtime (https://deno.land/) but could be easily rewritten to use NodeJS - using `fs.readFileSync`, see [here](https://nodejs.dev/learn/reading-files-with-nodejs). However headers of all .ts files would need small modifications too because NodeJS uses another module system than ES6 (Deno's module system is compatible with ES6).

To see an interactive example just run `./run.sh`.

### Why another XML parser?
- Back-end JavaScript does not offer DOMParser and/or XMLHttpRequest with its built-in XML parsers
- All existing XML parsers which I have found are either outdated (= don't even work) or they do not meet my requirements

### Current status:
- Works with most (all?) well-formed XML files
- Supports XML attributes, namespaces, CDATA sections
- Big files should be no problem (very fast processing, tested with 21000 nodes)

### To do:
- Node queries (basic XPath)
- Export of node query results to a CSV file (or XML file as well)

If you should find any issues, just let me know - preferably through GitHub discussions (https://github.com/Amarok24/TXP-XML-Parser/discussions).

### License:
This project is released as permissive free software under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
