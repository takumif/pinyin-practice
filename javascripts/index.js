/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />
$(function () {
    var dict = initCedictTree();
    var inputText = "";
    initBindings();
    function initCedictTree() {
        var url = "https://raw.githubusercontent.com/johnheroy/node-cc-cedict/master/src/cc-cedict.txt";
        var entries = CedictParser.parse(url);
        return new CedictTree(entries);
    }
    function initBindings() {
        $("#submitButton").click(function () {
            handleUserSubmission($("#inputText").val());
        });
    }
    function handleUserSubmission(text) {
        console.log(dict.getPrefixEntries(text));
        inputText = text;
        populateTextDiv();
    }
    function getEntriesForIndex(index) {
        var query = inputText.substring(index);
        return dict.getPrefixEntries(query);
    }
    function populateTextDiv() {
        for (var i = 0; i < inputText.length; i++) {
            $("#text").append("<div style='width: 100; float: left;'>" + inputText[i] + "</div>");
        }
    }
});
