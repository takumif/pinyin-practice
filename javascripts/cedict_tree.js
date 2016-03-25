/// <reference path="entry.ts" />
/**
 * An implementation of Cedict using the prefix tree data structure.
 * Each node (except for the root) contains a character, and contains a list of
 * entries formed by the characters in the path from the root to the node.
 * It uses the traditional attribute as the lookup key into the tree.
 */
var CedictTree = (function () {
    function CedictTree(entries) {
        this.root = new CedictTreeNode("");
        this.populateTree(entries);
    }
    CedictTree.prototype.getMatch = function (query) {
        var node = this.getNodeForWord(query);
        return node != null ? node.entries : [];
    };
    CedictTree.prototype.getEntriesStartingWith = function (query) {
        var node = this.getNodeForWord(query);
        return node != null ? this.gatherEntriesUnderNode(node) : [];
    };
    /**
     * E.g. for a query of "我們是" this will return 我 and 我們
     */
    CedictTree.prototype.getPrefixEntries = function (query) {
        var node = this.root;
        var entries = [];
        for (var i = 0; i < query.length; i++) {
            var nextChar = query[i];
            if (node.suffixes[nextChar] === undefined) {
                break;
            }
            node = node.suffixes[nextChar];
            Array.prototype.push.apply(entries, node.entries);
        }
        return entries;
    };
    CedictTree.prototype.populateTree = function (entries) {
        for (var i = 0; i < entries.length; i++) {
            this.insertEntry(entries[i]);
        }
    };
    CedictTree.prototype.insertEntry = function (entry) {
        var node = this.root;
        while (node.word != entry.traditional) {
            var nextChar = entry.traditional[node.word.length];
            if (node.suffixes[nextChar] === undefined) {
                // never seen this character sequence before, so make a node for it
                node.suffixes[nextChar] = new CedictTreeNode(node.word + nextChar);
            }
            node = node.suffixes[nextChar];
        }
        node.entries.push(entry);
    };
    CedictTree.prototype.gatherEntriesUnderNode = function (node) {
        if (node == null) {
            return [];
        }
        var entries = [];
        Array.prototype.push.apply(entries, node.entries);
        // get the entries from all the child nodes
        for (var suffix in node.suffixes) {
            Array.prototype.push.apply(entries, this.gatherEntriesUnderNode(node.suffixes[suffix]));
        }
        return entries;
    };
    /**
     * Returns null if the node is not found
     */
    CedictTree.prototype.getNodeForWord = function (word) {
        var node = this.root;
        for (var i = 0; i < word.length; i++) {
            var nextChar = word[i];
            if (node.suffixes[nextChar] === undefined) {
                return null;
            }
            node = node.suffixes[nextChar];
        }
        return node;
    };
    return CedictTree;
}());
var CedictTreeNode = (function () {
    function CedictTreeNode(w) {
        this.word = w;
        this.entries = [];
        this.suffixes = {};
    }
    return CedictTreeNode;
}());
