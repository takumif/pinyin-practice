/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />

$(() => {
    var dict: CedictTree = initCedictTree();
    initBindings();
});

function initCedictTree(): CedictTree {
    var url = "https://github.com/takumif/pinyin-practice/blob/gh-pages/data/cedict_ts.txt";
    var entries = CedictParser.parse(url);
    return new CedictTree(entries);
}

function initBindings(): void {
    $("#submitButton").click(() => {
        console.log($("#inputText").text);
    });
}