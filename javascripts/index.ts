/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />

$(() => {
    var dict: CedictTree = initCedictTree();
    var inputText = "";
    var currentTextIndex = 0;
    var selectedEntryIndex = 0;
    var currentIndexWithinEntry = 0;
    var currentEntries: Entry[] = [];
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
        
        $("body").keydown((event: JQueryKeyEventObject) => {
            handleKeyPress(event.which);
        });
    }

    function handleUserSubmission(text: string): void {
        console.log(dict.getPrefixEntries(text));
        inputText = text;
        populateTextDiv();
        setCurrentEntries();
    }
    
    function handleKeyPress(id: number): void {
        console.log(id);
        if (97 <= id && id <= 101) {
            // a number 1 through 5 was pressed on the numpad
            var selection = id - 96;
            handleToneSelection(selection);
        } else if (49 <= id && id <= 53) {
            // a number 1 through 5 was pressed on the number keys row
            var selection = id - 48;
            handleToneSelection(selection);
        } else if (id === 38 || id === 40) {
            // up and down arrows
            if (currentEntries.length > 0 && currentIndexWithinEntry === 0) {
                var delta = id === 38 ? -1 : 1;
                selectedEntryIndex = (selectedEntryIndex + delta + currentEntries.length) % currentEntries.length;
                console.log(currentEntries[selectedEntryIndex].traditional);
            }
        }
    }
    
    function handleToneSelection(tone: number): void {
        var selectedEntry = currentEntries[selectedEntryIndex];
        var selectedCharPinyin = selectedEntry.pinyin.split(" ")[currentIndexWithinEntry];
        if (tone === Number(selectedCharPinyin[selectedCharPinyin.length - 1])) {
            console.log("correct: " + selectedEntry.traditional + " " + selectedCharPinyin);
        } else {
            console.log("incorrect: " + selectedEntry.traditional + " " + selectedCharPinyin);
        }
        // TODO: do shit with selection
        
        if (currentIndexWithinEntry < selectedEntry.traditional.length - 1) {
            // still need to look at the remaining characters within the selected entry
            currentIndexWithinEntry++;
        } else {
            currentTextIndex += selectedEntry.traditional.length;
            if (currentTextIndex < inputText.length) {
                setCurrentEntries();
            }
        }
    }
    
    function populateTextDiv(): void {
        for (var i = 0; i < inputText.length; i++) {
            $("#text").append("<div style='width: 100; float: left;'>" + inputText[i] + "</div>");
        }
    }
    
    function setCurrentEntries(): void {
        var query = inputText.substring(currentTextIndex);
        currentEntries = dict.getPrefixEntries(query);
        selectedEntryIndex = 0;
        currentIndexWithinEntry = 0;
        
        console.log("set current entries:");
        console.log(currentEntries);
        
        if (currentEntries.length === 0) {
            currentTextIndex++;
            if (currentTextIndex >= inputText.length) {
                // TODO: deal with end of text
            } else {
                setCurrentEntries();
            }
        }
    }
});
