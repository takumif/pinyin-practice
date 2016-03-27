var Pinyin = (function () {
    function Pinyin() {
    }
    Pinyin.numeralToMark = function (pinyin) {
        var tone = Number(pinyin[pinyin.length - 1]);
        if (pinyin.length < 2 || isNaN(tone)) {
            return pinyin;
        }
        if (pinyin.indexOf(":") !== -1) {
            pinyin = pinyin.replace(":", "").replace("u", "ü");
        }
        pinyin = pinyin.replace("v", "ü");
        pinyin = pinyin.substr(0, pinyin.length - 1);
        var vowelToMark = Pinyin.getVowelToMark(pinyin);
        if (vowelToMark === "") {
            return pinyin;
        }
        return pinyin.replace(vowelToMark, Pinyin.markedVowels[vowelToMark][tone % 5]);
    };
    Pinyin.markToNumeral = function (pinyin, replaceüWith) {
        if (replaceüWith === void 0) { replaceüWith = "ü"; }
        for (var vowel in Pinyin.markedVowels) {
            for (var tone = 1; tone < 5; tone++) {
                var markedVowel = Pinyin.markedVowels[vowel][tone];
                if (pinyin.indexOf(markedVowel) !== -1) {
                    pinyin = pinyin.replace(markedVowel, vowel).replace("ü", replaceüWith);
                    return pinyin + String(tone);
                }
            }
        }
        pinyin = pinyin.replace("ü", replaceüWith);
        return pinyin + String(5);
    };
    Pinyin.getVowelToMark = function (pinyin) {
        if (pinyin.indexOf("a") !== -1) {
            return "a";
        }
        else if (pinyin.indexOf("A") !== -1) {
            return "A";
        }
        else if (pinyin.indexOf("e") !== -1) {
            return "e";
        }
        else if (pinyin.indexOf("E") !== -1) {
            return "E";
        }
        else if (pinyin.indexOf("o") !== -1) {
            return "o";
        }
        else if (pinyin.indexOf("O") !== -1) {
            return "O";
        }
        else if (pinyin.indexOf("i") !== -1 ||
            pinyin.indexOf("u") !== -1 ||
            pinyin.indexOf("ü") !== -1) {
            var lastVowelIndex = -1;
            var lastVowel = "";
            ["i", "u", "ü"].forEach(function (vowel, idx, arr) {
                var vowelIndex = pinyin.indexOf(vowel);
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
        ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
        A: ["A", "Ā", "Á", "Ǎ", "À"],
        E: ["E", "Ē", "É", "Ě", "È"],
        O: ["O", "Ō", "Ó", "Ǒ", "Ò"]
    };
    return Pinyin;
}());
