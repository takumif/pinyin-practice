/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />

$(() => {
    var dict: CedictTree = initCedictTree();
});

function initCedictTree(): CedictTree {
    var url = "https://raw.githubusercontent.com/johnheroy/node-cc-cedict/master/src/cc-cedict.txt";
    var entries = CedictParser.parse(url);
    return new CedictTree(entries);
}