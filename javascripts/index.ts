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
        inputText = text;
        currentTextIndex = 0;
        populateTextDiv();
        setCurrentEntries();
    }
    
    function handleKeyPress(id: number): void {
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
                updateEntriesDiv();
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
        updateTextAt(currentTextIndex, selectedCharPinyin);
        // TODO: do shit with selection
        
        currentTextIndex++;
        if (currentIndexWithinEntry < selectedEntry.traditional.length - 1) {
            // still need to look at the remaining characters within the selected entry
            currentIndexWithinEntry++;
        } else if (currentTextIndex < inputText.length) {
            setCurrentEntries();
        }
    }
    
    function updateTextAt(index: number, pinyin = ""): void {
        $("#char" + String(index)).append(pinyin);
    }
    
    function populateTextDiv(): void {
        $("#text").empty();
        for (var i = 0; i < inputText.length; i++) {
            var charDiv = $("<div/>", {
                id: "char" + String(i),
                class: "charDiv",
                text: inputText[i]
            })
            $("#text").append(charDiv);
        }
    }
    
    function updateEntriesDiv(): void {
        $("#entries").empty();
        for (var i = 0; i < currentEntries.length; i++) {
            var entry = currentEntries[i];
            var entryDiv = createEntryDiv(entry);
            if (i == selectedEntryIndex) {
                entryDiv.addClass("selectedEntry");
            }
            $("#entries").append(entryDiv);
        }
    }
    
    function createEntryDiv(entry: Entry): JQuery {
        var entryDiv = $("<div/>", {
            class: "entry"
        });
        var tradSpan = $("<span/>", {
            text: entry.traditional
        });
        var engSpan = $("<span/>", {
            text: entry.english
        });
        entryDiv.append(tradSpan).append(engSpan);
        return entryDiv;
    }
    
    function setCurrentEntries(): void {
        var query = inputText.substring(currentTextIndex);
        currentEntries = dict.getPrefixEntries(query);
        selectedEntryIndex = 0;
        currentIndexWithinEntry = 0;
        updateEntriesDiv();
        
        if (currentEntries.length === 0) {
            // we've hit a character not in the dictionary
            currentTextIndex++;
            if (currentTextIndex >= inputText.length) {
                // TODO: deal with end of text
            } else {
                setCurrentEntries();
            }
        }
    }
});
