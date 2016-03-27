/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="entry.ts" />
/// <reference path="cedict_parser.ts" />
/// <reference path="cedict_tree.ts" />
/// <reference path="pinyin.ts" />

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
        $("#previousButton").click(() =>{
            handleUsePreviousText();
        });
        $("body").keydown((event: JQueryKeyEventObject) => {
            handleKeyPress(event.which);
        });
    }

    function handleUserSubmission(text: string): void {
        localStorage.setItem("text", text);
        startWithText(text);
    }
    
    function handleUsePreviousText(): void {
        var text = localStorage.getItem("text");
        $("#inputText").text(text);
        startWithText(text);
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
                changeSelectedEntry((selectedEntryIndex + delta + currentEntries.length) % currentEntries.length);
            }
        }
    }
    
    function handleToneSelection(tone: number): void {
        var selectedEntry = currentEntries[selectedEntryIndex];
        var selectedCharPinyin = selectedEntry.pinyin.split(" ")[currentIndexWithinEntry];
        var correctTone = Number(selectedCharPinyin[selectedCharPinyin.length - 1]);
        updateTextAt(currentTextIndex, tone === correctTone, selectedCharPinyin, correctTone);
        // TODO: do shit with selection
        
        currentTextIndex++;
        if (currentIndexWithinEntry < selectedEntry.traditional.length - 1) {
            // still need to look at the remaining characters within the selected entry
            currentIndexWithinEntry++;
        } else if (currentTextIndex < inputText.length) {
            setCurrentEntries();
        }
    }
    
    function startWithText(text: string): void {
        inputText = text;
        currentTextIndex = 0;
        populateTextDiv();
        setCurrentEntries();
    }
    
    function changeSelectedEntry(index: number): void {
        selectedEntryIndex = index;
        updateEntriesDiv();
        
        $(".selectedEntryChar").removeClass("selectedEntryChar");
        if (currentEntries.length > 0) {
            var selectedEntry = currentEntries[index];
            for (var i = 0; i < selectedEntry.traditional.length; i++) {
                $("#char" + String(currentTextIndex + i)).addClass("selectedEntryChar");
            }
        }
    }
    
    function updateTextAt(index: number, correctTone: boolean, pinyin = "", color: number = null): void {
        var charDiv = $("#char" + String(index));
        charDiv.find("rt").text(Pinyin.numeralToMark(pinyin));
        if (correctTone) {
            charDiv.addClass("correctTone");
        } else {
            charDiv.addClass("incorrectTone");
        }
        if (color) {
            charDiv.addClass("tone" + String(color));
        }
    }
    
    function populateTextDiv(): void {
        $("#text").empty();
        for (var i = 0; i < inputText.length; i++) {
            var charDiv = $("<div/>", {
                id: "char" + String(i),
                class: "charDiv"
            }).html("<ruby>" + inputText[i] + "<rt>&nbsp;</rt></ruby>");
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
        currentEntries = dict.getPrefixEntries(query).sort(compareEntries);
        currentIndexWithinEntry = 0;
        changeSelectedEntry(0);
        
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
    
    function compareEntries(e1: Entry, e2: Entry): number {
        if (e1.traditional.length > e2.traditional.length) {
            return -1;
        } else if (e1.traditional.length < e2.traditional.length) {
            return 1;
        } else if (e1.english.length > e2.english.length) {
            return -1;
        } else if (e1.english.length < e2.english.length) {
            return 1;
        } else {
            return 0;
        }
    }
});
