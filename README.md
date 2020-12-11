# TXP XML-Parser

### A fast and tiny XML parser.

This is a back-end project (command line), currently made to work with Deno runtime (https://deno.land/) but can be easily ported to NodeJS.

To see an interactive example just execute run.sh (Deno runtime neede).


### Current status:
- Works with most valid XML files (also works with UTF-8 BOM)
- Full support for XML attributes and CDATA sections
- Big files should be no problem (very fast processing, tested with 21000 nodes)

### To do:
- Support for XMLs which contain namespaced nodes
- Node queries
- Export of node queries to a CSV file (or XML file as well)


If you should find any issues, just let me know (preferably over Twitter or E-Mail).
