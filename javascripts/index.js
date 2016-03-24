/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />
$(function () {
    var dict = initCedictTree();
});
function initCedictTree() {
    var url = "../data/cedict_ts.u8";
    var entries = CedictParser.parse(url);
    return new CedictTree(entries);
}
