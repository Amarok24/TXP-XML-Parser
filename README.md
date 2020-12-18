# TXP XML-Parser

### A fast and tiny XML parser.

This is a back-end project (command line), currently made to work with Deno runtime (https://deno.land/) but can be easily ported to NodeJS.

To see an interactive example just run `./run.sh`.

### Why another XML parser?
- Back-end JavaScript does not offer DOMParser and/or XMLHttpRequest with its built-in XML parsers
- All existing XML parsers which I have found are either outdated (= don't even work) or they do not meet my requirements

### Current status:
- Works with most (all?) well-formed XML files
- Supports XML attributes, namespaces, CDATA sections
- Big files should be no problem (very fast processing, tested with 21000 nodes)

### To do:
- Node queries
- Export of node query results to a CSV file (or XML file as well)


If you should find any issues, just let me know - preferably through GitHub discussions (https://github.com/Amarok24/TXP-XML-Parser/discussions).
