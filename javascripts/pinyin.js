var Pinyin = (function () {
    function Pinyin() {
    }
    Pinyin.numeralToMark = function (numPin) {
        var tone = Number(numPin[numPin.length - 1]);
        if (numPin.length < 2 || isNaN(tone)) {
            return numPin;
        }
        if (numPin.indexOf(":") !== -1) {
            numPin = numPin.replace(":", "").replace("u", "ü");
        }
        numPin = numPin.replace("v", "ü");
        numPin = numPin.substr(0, numPin.length - 1);
        var vowelToMark = Pinyin.getVowelToMark(numPin);
        if (vowelToMark === "") {
            return numPin;
        }
        return numPin.replace(vowelToMark, Pinyin.markedVowels[vowelToMark][tone % 5]);
    };
    Pinyin.getVowelToMark = function (numPin) {
        if (numPin.indexOf("a") !== -1) {
            return "a";
        }
        else if (numPin.indexOf("e") !== -1) {
            return "e";
        }
        else if (numPin.indexOf("o") !== -1) {
            return "o";
        }
        else if (numPin.indexOf("i") !== -1 ||
            numPin.indexOf("u") !== -1 ||
            numPin.indexOf("ü") !== -1) {
            var lastVowelIndex = -1;
            var lastVowel = "";
            ["i", "u", "ü"].forEach(function (vowel, idx, arr) {
                var vowelIndex = numPin.indexOf(vowel);
                if (vowelIndex > lastVowelIndex) {
                    lastVowelIndex = vowelIndex;
                    lastVowel = vowel;
                }
            });
            return lastVowel;
        }
        else {
            return "";
        }
    };
    Pinyin.markedVowels = {
        a: ["a", "ā", "á", "ǎ", "à"],
        e: ["e", "ē", "é", "ě", "è"],
        i: ["i", "ī", "í", "ǐ", "ì"],
        o: ["o", "ō", "ó", "ǒ", "ò"],
        u: ["u", "ū", "ú", "ǔ", "ù"],
        ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"]
    };
    return Pinyin;
})();
