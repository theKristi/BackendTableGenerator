(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TableParser = (function () {
    function TableParser() {
    }
    TableParser.prototype.parseFromHtml = function (tableHtml, threshold, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var tbody, attributes, numberOfPromises, i, startingIndex, endingIndex, dataChunk, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tbody = tableHtml.tBodies[0];
                        attributes = this.getAttributesFromHtml((tableHtml.tHead.children[0]));
                        numberOfPromises = Math.floor(tbody.rows.length / threshold);
                        if (tbody.rows.length % threshold > 0)
                            numberOfPromises++;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < numberOfPromises)) return [3 /*break*/, 4];
                        startingIndex = i * threshold;
                        endingIndex = startingIndex + threshold;
                        if (endingIndex > tbody.rows.length)
                            endingIndex = tableHtml.rows.length;
                        dataChunk = [];
                        //walk up 
                        while (startingIndex <= endingIndex) {
                            dataChunk.push(tbody.rows[i]);
                            startingIndex++;
                        }
                        return [4 /*yield*/, this.createPromise((dataChunk), attributes)];
                    case 2:
                        result = _a.sent();
                        callback(result);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TableParser.prototype.getAttributesFromHtml = function (headerRow) {
        var cellsArray = headerRow.cells;
        var attributes = [];
        for (var entry in cellsArray) {
            if (cellsArray[entry].textContent !== undefined) {
                var string = cellsArray[entry].textContent.trim();
                string = string.replace(/\s+/g, '');
                attributes.push(string);
            }
        }
        return attributes;
    };
    TableParser.prototype.emptyObject = function (attributes, htmlElement) {
        var object = { html: htmlElement };
        for (var attribute in attributes) {
            object[attributes[attribute]] = "";
        }
        return object;
    };
    TableParser.prototype.createObjectFromRow = function (tableRow, attributes) {
        var newObject = this.emptyObject(attributes, tableRow);
        var row = tableRow.children;
        for (var cell = 0; cell < row.length; cell++) {
            if (attributes[cell] != undefined) {
                if (row[cell].children[0] !== undefined) {
                    //get child property value
                    var chlidNodeName = row[cell].children[0].nodeName;
                    var childClassName = row[cell].children[0].className;
                    var rowObject = void 0;
                    switch (chlidNodeName) {
                        case "SELECT":
                            rowObject = row[cell].children[0];
                            newObject[attributes[cell]] = rowObject.selectedOptions[0].value;
                            break;
                        case "INPUT":
                            if (childClassName === "check-box")
                                rowObject = row[cell].children[0];
                            newObject[attributes[cell]] = rowObject ? rowObject.checked : false;
                            break;
                        case "SPAN":
                            newObject[attributes[cell]] = row[cell].textContent.trim();
                            break;
                        default:
                            newObject[attributes[cell]] = row[cell].children[0].textContent.trim();
                            break;
                    }
                }
                else {
                    var string = row[cell].textContent.replace("\\n", "").trim();
                    newObject[attributes[cell]] = string;
                }
            }
        }
        return newObject;
    };
    TableParser.prototype.parseDataChunk = function (dataChunk, attributes) {
        var list = [];
        for (var i = 0; i < dataChunk.length; i++) {
            var newObject = this.createObjectFromRow(dataChunk[i], attributes);
            list.push(newObject);
        }
        return list;
    };
    TableParser.prototype.createPromise = function (dataChunk, attributes) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var list = _this.parseDataChunk(dataChunk, attributes);
            resolve(list);
        });
    };
    return TableParser;
}());
exports.TableParser = TableParser;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableParserAsync_1 = require("./TableParserAsync");
document.addEventListener("DOMContentLoaded", function (event) {
    //do work
    //tableViews = [];
    //var List=new List();
    var parser = new TableParserAsync_1.TableParser();
    var tables = document.querySelectorAll("[data-list-manipulate]");
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        parser.parseFromHtml(table, 10000, function (data) {
            console.log("parsed");
            table.classList.remove("hidden");
        });
    }
});
},{"./TableParserAsync":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVGFibGVQYXJzZXJBc3luYy50cyIsInNyYy9zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQTtJQUFBO0lBeUdBLENBQUM7SUF4R1EsbUNBQWEsR0FBbkIsVUFBb0IsU0FBMEIsRUFBRSxTQUFnQixFQUFFLFFBQWlCOztnQkFDMUUsS0FBSyxFQUNMLFVBQVUsRUFFVixnQkFBZ0IsS0FJWixhQUFhLEVBQ2IsV0FBVyxFQUdYLFNBQVM7Ozs7Z0NBWG1CLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFRO3FDQUM5QyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBUSxDQUFDOzJDQUVsRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzt3QkFDeEUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFDLENBQUMsQ0FBQzs0QkFDOUIsZ0JBQWdCLEVBQUUsQ0FBQzs0QkFDWCxDQUFDOzs7NkJBQUUsQ0FBQSxDQUFDLEdBQUcsZ0JBQWdCLENBQUE7d0NBQ0osQ0FBQyxHQUFHLFNBQVM7c0NBQ2YsYUFBYSxHQUFHLFNBQVM7d0JBQ25ELEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs0QkFDaEMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29DQUN4QixFQUFFO3dCQUNsQixVQUFVO3dCQUNWLE9BQU8sYUFBYSxJQUFJLFdBQVcsRUFBRSxDQUFDOzRCQUNsQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMs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QUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v1xyXG5leHBvcnQgY2xhc3MgVGFibGVQYXJzZXIge1xyXG4gICBhc3luYyBwYXJzZUZyb21IdG1sKHRhYmxlSHRtbDpIVE1MVGFibGVFbGVtZW50LCB0aHJlc2hvbGQ6bnVtYmVyLCBjYWxsYmFjazpGdW5jdGlvbikge1xyXG4gICAgICAgIGxldCB0Ym9keTpIVE1MVGFibGVTZWN0aW9uRWxlbWVudCA9IHRhYmxlSHRtbC50Qm9kaWVzWzBdIGFzIGFueTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc0Zyb21IdG1sKCh0YWJsZUh0bWwudEhlYWQuY2hpbGRyZW5bMF0pIGFzIGFueSk7XHJcbiAgICAgICAgLy9jcmVhdGUgUHJvbWlzZXMgYmFzZWQgb24gdGhyZXNob2xkICBcclxuICAgICAgICBsZXQgbnVtYmVyT2ZQcm9taXNlczogbnVtYmVyID0gTWF0aC5mbG9vcih0Ym9keS5yb3dzLmxlbmd0aCAvIHRocmVzaG9sZCk7XHJcbiAgICAgICAgaWYodGJvZHkucm93cy5sZW5ndGggJSB0aHJlc2hvbGQ+MClcclxuICAgICAgICAgICAgIG51bWJlck9mUHJvbWlzZXMrKzsgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZlByb21pc2VzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0aW5nSW5kZXg6IG51bWJlciA9IGkgKiB0aHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIGxldCBlbmRpbmdJbmRleDogbnVtYmVyID0gc3RhcnRpbmdJbmRleCArIHRocmVzaG9sZDtcclxuICAgICAgICAgICAgaWYgKGVuZGluZ0luZGV4ID4gdGJvZHkucm93cy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBlbmRpbmdJbmRleCA9IHRhYmxlSHRtbC5yb3dzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGRhdGFDaHVuayA9IFtdO1xyXG4gICAgICAgICAgICAvL3dhbGsgdXAgXHJcbiAgICAgICAgICAgIHdoaWxlIChzdGFydGluZ0luZGV4IDw9IGVuZGluZ0luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQ2h1bmsucHVzaCh0Ym9keS5yb3dzW2ldKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nSW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGxldCByZXN1bHQ6SVRhYmxlUm93W10gPSBhd2FpdCB0aGlzLmNyZWF0ZVByb21pc2UoKGRhdGFDaHVuaykgYXMgYW55LCBhdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBnZXRBdHRyaWJ1dGVzRnJvbUh0bWwoaGVhZGVyUm93OkhUTUxUYWJsZVJvd0VsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxzQXJyYXk6SFRNTENvbGxlY3Rpb25PZjxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+ID0gaGVhZGVyUm93LmNlbGxzO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBlbnRyeSBpbiBjZWxsc0FycmF5KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2VsbHNBcnJheVtlbnRyeV0udGV4dENvbnRlbnQhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nID0gY2VsbHNBcnJheVtlbnRyeV0udGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xccysvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKHN0cmluZyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG4gICAgZW1wdHlPYmplY3QoYXR0cmlidXRlczpzdHJpbmdbXSwgaHRtbEVsZW1lbnQ6SFRNTFRhYmxlUm93RWxlbWVudCk6SVRhYmxlUm93IHtcclxuICAgIGxldCBvYmplY3QgPSB7aHRtbDpodG1sRWxlbWVudH07XHJcbiAgICBmb3IgKGxldCBhdHRyaWJ1dGUgaW4gYXR0cmlidXRlcykge1xyXG4gICAgICAgIG9iamVjdFthdHRyaWJ1dGVzW2F0dHJpYnV0ZV1dID0gXCJcIjtcclxuICAgIH1cclxuICAgICAgIFxyXG4gICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuICAgIGNyZWF0ZU9iamVjdEZyb21Sb3codGFibGVSb3c6SFRNTFRhYmxlUm93RWxlbWVudCxhdHRyaWJ1dGVzOnN0cmluZ1tdKTpJVGFibGVSb3cge1xyXG4gICAgICAgXHJcbiAgICAgICAgbGV0IG5ld09iamVjdCA9IHRoaXMuZW1wdHlPYmplY3QoYXR0cmlidXRlcywgdGFibGVSb3cpO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHJvdyA9IHRhYmxlUm93LmNoaWxkcmVuO1xyXG5cclxuICAgIGZvciAodmFyIGNlbGwgPSAwOyBjZWxsIDwgcm93Lmxlbmd0aDsgY2VsbCsrKSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbY2VsbF0gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3dbY2VsbF0uY2hpbGRyZW5bMF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY2hpbGQgcHJvcGVydHkgdmFsdWVcclxuICAgICAgICAgICAgICAgIHZhciBjaGxpZE5vZGVOYW1lID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkQ2xhc3NOYW1lID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgICAgIGxldCByb3dPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNobGlkTm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU0VMRUNUXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd09iamVjdD0gcm93W2NlbGxdLmNoaWxkcmVuWzBdIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dPYmplY3Quc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkQ2xhc3NOYW1lID09PSBcImNoZWNrLWJveFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93T2JqZWN0ID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dPYmplY3Q/IHJvd09iamVjdC5jaGVja2VkOmZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1BBTlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dbY2VsbF0udGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dbY2VsbF0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJpbmcgPSByb3dbY2VsbF0udGV4dENvbnRlbnQucmVwbGFjZShcIlxcXFxuXCIsIFwiXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBuZXdPYmplY3Q7XHJcbiAgICB9XHJcbiAgICBwYXJzZURhdGFDaHVuayhkYXRhQ2h1bms6IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTFRhYmxlUm93RWxlbWVudD4sIGF0dHJpYnV0ZXM6IHN0cmluZ1tdKTpJVGFibGVSb3dbXSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6IElUYWJsZVJvd1tdPVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUNodW5rLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB0aGlzLmNyZWF0ZU9iamVjdEZyb21Sb3coZGF0YUNodW5rW2ldIGFzIGFueSAsYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChuZXdPYmplY3QpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVQcm9taXNlKGRhdGFDaHVuazogSFRNTENvbGxlY3Rpb25PZjxIVE1MVGFibGVSb3dFbGVtZW50PiwgYXR0cmlidXRlczogc3RyaW5nW10pOlByb21pc2U8SVRhYmxlUm93W10+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMucGFyc2VEYXRhQ2h1bmsoZGF0YUNodW5rLCBhdHRyaWJ1dGVzKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShsaXN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIElUYWJsZVJvdyB7XHJcbiAgICBodG1sOkhUTUxUYWJsZVJvd0VsZW1lbnRcclxufVxyXG4iLCLvu79pbXBvcnQgeyBUYWJsZVBhcnNlciB9IGZyb20gXCIuL1RhYmxlUGFyc2VyQXN5bmNcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuL0xpc3RcIlxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIC8vZG8gd29ya1xyXG4gICAgLy90YWJsZVZpZXdzID0gW107XHJcblxyXG4gICAgLy92YXIgTGlzdD1uZXcgTGlzdCgpO1xyXG4gICAgdmFyIHBhcnNlcj0gbmV3IFRhYmxlUGFyc2VyKCk7XHJcbiAgICBsZXQgdGFibGVzOkhUTUxDb2xsZWN0aW9uT2Y8SFRNTFRhYmxlRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtbGlzdC1tYW5pcHVsYXRlXVwiKSBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxUYWJsZUVsZW1lbnQ+O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIFx0dmFyIHRhYmxlOkhUTUxUYWJsZUVsZW1lbnQ9dGFibGVzW2ldIGFzIEhUTUxUYWJsZUVsZW1lbnQ7XHJcbiAgICAgICAgcGFyc2VyLnBhcnNlRnJvbUh0bWwodGFibGUsIDEwMDAwLCBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICBcdGNvbnNvbGUubG9nKFwicGFyc2VkXCIpO1xyXG4gICAgICAgIFx0dGFibGUuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG59KTsiXX0=
