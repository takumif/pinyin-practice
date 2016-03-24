/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />

$(() => {
    var dict: CedictTree = initCedictTree();
    var inputText = "";
    initBindings();
    
    function initCedictTree(): CedictTree {
        var url = "https://raw.githubusercontent.com/johnheroy/node-cc-cedict/master/src/cc-cedict.txt";
        var entries = CedictParser.parse(url);
        return new CedictTree(entries);
    }

    function initBindings(): void {
        $("#submitButton").click(() => {
            handleUserSubmission($("#inputText").val());
        });
    }

    function handleUserSubmission(text: string): void {
        console.log(dict.getPrefixEntries(text));
        inputText = text;
        populateTextDiv();
    }
    
    function getEntriesForIndex(index: number): Entry[] {
        var query = inputText.substring(index);
        return dict.getPrefixEntries(query);
    }
    
    function populateTextDiv(): void {
        for (var i = 0; i < inputText.length; i++) {
            $("#text").append("<div style='width: 100; float: left;'>" + inputText[i] + "</div>");
        }
    }
});
