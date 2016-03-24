/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />
$(function () {
    var dict = initCedictTree();
    initBindings();
});
function initCedictTree() {
    var url = "https://github.com/takumif/pinyin-practice/blob/gh-pages/data/cedict_ts.txt";
    var entries = CedictParser.parse(url);
    return new CedictTree(entries);
}
function initBindings() {
    $("#submitButton").click(function () {
        console.log($("#inputText").text);
    });
}
