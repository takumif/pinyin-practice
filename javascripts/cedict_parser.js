/// <reference path="entry.ts" />
var CedictParser = (function () {
    function CedictParser() {
    }
    /**
     * Parses a CEDICT text file into a list of entries
     */
    CedictParser.parse = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false); // "false" to open synchronously
        xhr.send();
        return CedictParser.parseCedictText(xhr.responseText);
    };
    CedictParser.parseCedictText = function (text) {
        var lines = text.split("\n");
        var entries = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            // ignore non-entry lines
            if (line.length === 0 || line[0] === "#") {
                continue;
            }
            entries.push(CedictParser.parseCedictLine(line));
        }
        return entries;
    };
    CedictParser.parseCedictLine = function (line) {
        // Entries have this format:
        // TRADITIONAL SIMPLIFIED [PINYIN] /ENGLISH 1/ENGLISH 2/
        var firstSpace = line.indexOf(" ");
        var secondSpace = line.indexOf(" ", firstSpace + 1);
        var leftBracket = line.indexOf("[");
        var rightBracket = line.indexOf("]");
        var firstSlash = line.indexOf("/");
        var lastChar = line.length - 1;
        var traditional = line.substr(0, firstSpace);
        var simplified = line.substr(firstSpace + 1, secondSpace - firstSpace - 1);
        var pinyin = line.substr(leftBracket + 1, rightBracket - leftBracket - 1);
        var english = line.substr(firstSlash + 1, lastChar - firstSlash - 1);
        return new Entry(traditional, simplified, pinyin, english);
    };
    return CedictParser;
}());