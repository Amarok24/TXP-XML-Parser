# TXP XML-Parser

### A fast and tiny XML parser.

This is a back-end project (command line), currently made to work with Deno runtime (https://deno.land/) but can be easily ported to NodeJS.

To see an interactive example just execute run.sh (Deno runtime needed).


### Current status:
- Works with most valid XML files (also works with UTF-8 BOM)
- Supports XML attributes and CDATA sections
- Supports XML namespaces
- Big files should be no problem (very fast processing, tested with 21000 nodes)

### To do:
- Node queries
- Export of node queries to a CSV file (or XML file as well)


If you should find any issues, just let me know - preferably through GitHub discussions (https://github.com/Amarok24/TXP-XML-Parser/discussions).
