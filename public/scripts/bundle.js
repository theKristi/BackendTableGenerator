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
                        return [4 /*yield*/, this.parseDataChunk(dataChunk, attributes)];
                    case 2:
                        result = _a.sent();
                        ;
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
            if (cellsArray[entry].outerText !== undefined) {
                var string = cellsArray[entry].outerText.trim();
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
        // let rowparent = tableRow;
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
    var parser = new TableParserAsync_1.TableParser();
    var tables = document.querySelectorAll("[data-list-manipulate]");
    for (var i = 0; i < tables.length; i++) {
        parser.parseFromHtml(tables[i], 10000, function (data) {
            console.log("parsed data");
        });
    }
});
},{"./TableParserAsync":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVGFibGVQYXJzZXJBc3luYy50cyIsInNyYy9zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNDQTtJQUFBO0lBeUdBLENBQUM7SUF4R08sbUNBQWEsR0FBbkIsVUFBb0IsU0FBMEIsRUFBRSxTQUFnQixFQUFFLFFBQWlCOztnQkFDekUsS0FBSyxFQUNMLFVBQVUsRUFFVixnQkFBZ0IsS0FJWixhQUFhLEVBQ2IsV0FBVyxFQUdYLFNBQVM7Ozs7Z0NBWEwsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUNBQ2YsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQVEsQ0FBQzsyQ0FFbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7d0JBQ3hFLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsR0FBQyxDQUFDLENBQUM7NEJBQzlCLGdCQUFnQixFQUFFLENBQUM7NEJBQ1gsQ0FBQzs7OzZCQUFFLENBQUEsQ0FBQyxHQUFHLGdCQUFnQixDQUFBO3dDQUNKLENBQUMsR0FBRyxTQUFTO3NDQUNmLGFBQWEsR0FBRyxTQUFTO3dCQUNuRCxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQ2hDLFdBQVcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQ0FDeEIsRUFBRTt3QkFDbEIsVUFBVTt3QkFDVixPQUFPLGFBQWEsSUFBSSxXQUFXLEVBQUUsQ0FBQzs0QkFDbEMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzlCLGFBQWEsRUFBRSxDQUFDO3dCQUNwQixDQUFDO3dCQUNZLHFCQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBZ0IsRUFBRSxVQUFVLENBQUMsRUFBQTs7aUNBQXZELFNBQXVEO3dCQUF1RCxDQUFDO3dCQUM1SCxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Ozt3QkFaaUIsQ0FBQyxFQUFFLENBQUE7Ozs7OztLQWdCNUM7SUFDRCwyQ0FBcUIsR0FBckIsVUFBc0IsU0FBNkI7UUFFL0MsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUdqQyxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hELE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDcEMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUNELGlDQUFXLEdBQVgsVUFBWSxVQUFtQixFQUFFLFdBQStCO1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUMsSUFBSSxFQUFDLFdBQVcsRUFBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN2QyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNkLENBQUM7SUFDRCx5Q0FBbUIsR0FBbkIsVUFBb0IsUUFBNEIsRUFBQyxVQUFtQjtRQUNqRSw0QkFBNEI7UUFDM0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkQsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUVoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN0QywwQkFBMEI7b0JBQzFCLElBQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO29CQUNuRCxJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDckQsSUFBSSxTQUFTLFNBQUEsQ0FBQztvQkFDZCxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO3dCQUNwQixLQUFLLFFBQVE7NEJBQ1QsU0FBUyxHQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFzQixDQUFDOzRCQUN0RCxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7NEJBQ2pFLEtBQUssQ0FBQzt3QkFDVixLQUFLLE9BQU87NEJBQ1IsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLFdBQVcsQ0FBQztnQ0FDL0IsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFxQixDQUFDOzRCQUN0RCxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFFLFNBQVMsQ0FBQyxPQUFPLEdBQUMsS0FBSyxDQUFDOzRCQUNyRSxLQUFLLENBQUM7d0JBQ1YsS0FBSyxNQUFNOzRCQUNQLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUMzRCxLQUFLLENBQUM7d0JBQ1Y7NEJBQ0ksU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUN2RSxLQUFLLENBQUM7b0JBQ2QsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFN0QsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDekMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNqQixDQUFDO0lBQ0Qsb0NBQWMsR0FBZCxVQUFlLFNBQWdELEVBQUUsVUFBb0I7UUFDakYsSUFBSSxJQUFJLEdBQWMsRUFBRSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsbUNBQWEsR0FBYixVQUFjLFNBQWdELEVBQUUsVUFBb0I7UUFBcEYsaUJBS0M7UUFKRyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixJQUFJLElBQUksR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQXpHQSxBQXlHQyxJQUFBO0FBekdZLGtDQUFXOzs7O0FDRHZCLHVEQUFpRDtBQUNsRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxLQUFLO0lBQ3pELFNBQVM7SUFDVCxrQkFBa0I7SUFDbEIsSUFBSSxNQUFNLEdBQUUsSUFBSSw4QkFBVyxFQUFFLENBQUM7SUFDOUIsSUFBSSxNQUFNLEdBQXNDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBdUMsQ0FBQztJQUMxSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBUyxJQUFJO1lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/XHJcbmV4cG9ydCBjbGFzcyBUYWJsZVBhcnNlciB7XHJcbiAgYXN5bmMgcGFyc2VGcm9tSHRtbCh0YWJsZUh0bWw6SFRNTFRhYmxlRWxlbWVudCwgdGhyZXNob2xkOm51bWJlciwgY2FsbGJhY2s6RnVuY3Rpb24pIHtcclxuICAgICAgICBsZXQgdGJvZHkgPSB0YWJsZUh0bWwudEJvZGllc1swXTtcclxuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc0Zyb21IdG1sKCh0YWJsZUh0bWwudEhlYWQuY2hpbGRyZW5bMF0pIGFzIGFueSk7XHJcbiAgICAgICAgLy9jcmVhdGUgUHJvbWlzZXMgYmFzZWQgb24gdGhyZXNob2xkICBcclxuICAgICAgICBsZXQgbnVtYmVyT2ZQcm9taXNlczogbnVtYmVyID0gTWF0aC5mbG9vcih0Ym9keS5yb3dzLmxlbmd0aCAvIHRocmVzaG9sZCk7XHJcbiAgICAgICAgaWYodGJvZHkucm93cy5sZW5ndGggJSB0aHJlc2hvbGQ+MClcclxuICAgICAgICAgICAgIG51bWJlck9mUHJvbWlzZXMrKzsgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZlByb21pc2VzOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0aW5nSW5kZXg6IG51bWJlciA9IGkgKiB0aHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIGxldCBlbmRpbmdJbmRleDogbnVtYmVyID0gc3RhcnRpbmdJbmRleCArIHRocmVzaG9sZDtcclxuICAgICAgICAgICAgaWYgKGVuZGluZ0luZGV4ID4gdGJvZHkucm93cy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICBlbmRpbmdJbmRleCA9IHRhYmxlSHRtbC5yb3dzLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IGRhdGFDaHVuayA9IFtdO1xyXG4gICAgICAgICAgICAvL3dhbGsgdXAgXHJcbiAgICAgICAgICAgIHdoaWxlIChzdGFydGluZ0luZGV4IDw9IGVuZGluZ0luZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhQ2h1bmsucHVzaCh0Ym9keS5yb3dzW2ldKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0aW5nSW5kZXgrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgdGhpcy5wYXJzZURhdGFDaHVuayhkYXRhQ2h1bmsgYXMgYW55LCBhdHRyaWJ1dGVzKTsvKnRoaXMuY3JlYXRlUHJvbWlzZSgoZGF0YUNodW5rKSBhcyBhbnksIGF0dHJpYnV0ZXMpKi87XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBnZXRBdHRyaWJ1dGVzRnJvbUh0bWwoaGVhZGVyUm93OkhUTUxUYWJsZVJvd0VsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGNlbGxzQXJyYXkgPSBoZWFkZXJSb3cuY2VsbHM7XHJcblxyXG5cclxuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGVudHJ5IGluIGNlbGxzQXJyYXkpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjZWxsc0FycmF5W2VudHJ5XS5vdXRlclRleHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0cmluZyA9IGNlbGxzQXJyYXlbZW50cnldLm91dGVyVGV4dC50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxzKy9nLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goc3RyaW5nKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcbiAgICBlbXB0eU9iamVjdChhdHRyaWJ1dGVzOnN0cmluZ1tdLCBodG1sRWxlbWVudDpIVE1MVGFibGVSb3dFbGVtZW50KTpJVGFibGVSb3cge1xyXG4gICAgbGV0IG9iamVjdCA9IHtodG1sOmh0bWxFbGVtZW50fTtcclxuICAgIGZvciAobGV0IGF0dHJpYnV0ZSBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgb2JqZWN0W2F0dHJpYnV0ZXNbYXR0cmlidXRlXV0gPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgICAgXHJcbiAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG4gICAgY3JlYXRlT2JqZWN0RnJvbVJvdyh0YWJsZVJvdzpIVE1MVGFibGVSb3dFbGVtZW50LGF0dHJpYnV0ZXM6c3RyaW5nW10pOklUYWJsZVJvdyB7XHJcbiAgICAgICAvLyBsZXQgcm93cGFyZW50ID0gdGFibGVSb3c7XHJcbiAgICAgICAgbGV0IG5ld09iamVjdCA9IHRoaXMuZW1wdHlPYmplY3QoYXR0cmlidXRlcywgdGFibGVSb3cpO1xyXG4gICAgXHJcbiAgICAgICAgdmFyIHJvdyA9IHRhYmxlUm93LmNoaWxkcmVuO1xyXG5cclxuICAgIGZvciAodmFyIGNlbGwgPSAwOyBjZWxsIDwgcm93Lmxlbmd0aDsgY2VsbCsrKSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXNbY2VsbF0gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChyb3dbY2VsbF0uY2hpbGRyZW5bMF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY2hpbGQgcHJvcGVydHkgdmFsdWVcclxuICAgICAgICAgICAgICAgIHZhciBjaGxpZE5vZGVOYW1lID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkQ2xhc3NOYW1lID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgICAgIGxldCByb3dPYmplY3Q7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNobGlkTm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU0VMRUNUXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd09iamVjdD0gcm93W2NlbGxdLmNoaWxkcmVuWzBdIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dPYmplY3Quc2VsZWN0ZWRPcHRpb25zWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiSU5QVVRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkQ2xhc3NOYW1lID09PSBcImNoZWNrLWJveFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93T2JqZWN0ID0gcm93W2NlbGxdLmNoaWxkcmVuWzBdIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dPYmplY3Q/IHJvd09iamVjdC5jaGVja2VkOmZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1BBTlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dbY2VsbF0udGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSByb3dbY2VsbF0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHJpbmcgPSByb3dbY2VsbF0udGV4dENvbnRlbnQucmVwbGFjZShcIlxcXFxuXCIsIFwiXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXdPYmplY3RbYXR0cmlidXRlc1tjZWxsXV0gPSBzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBuZXdPYmplY3Q7XHJcbiAgICB9XHJcbiAgICBwYXJzZURhdGFDaHVuayhkYXRhQ2h1bms6IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTFRhYmxlUm93RWxlbWVudD4sIGF0dHJpYnV0ZXM6IHN0cmluZ1tdKTpJVGFibGVSb3dbXSB7XHJcbiAgICAgICAgbGV0IGxpc3Q6IElUYWJsZVJvd1tdPVtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUNodW5rLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdPYmplY3QgPSB0aGlzLmNyZWF0ZU9iamVjdEZyb21Sb3coZGF0YUNodW5rW2ldLGF0dHJpYnV0ZXMpO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2gobmV3T2JqZWN0KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0O1xyXG4gICAgfVxyXG4gICAgY3JlYXRlUHJvbWlzZShkYXRhQ2h1bms6IEhUTUxDb2xsZWN0aW9uT2Y8SFRNTFRhYmxlUm93RWxlbWVudD4sIGF0dHJpYnV0ZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLnBhcnNlRGF0YUNodW5rKGRhdGFDaHVuaywgYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIHJlc29sdmUobGlzdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVGFibGVSb3cge1xyXG4gICAgaHRtbDpIVE1MVGFibGVSb3dFbGVtZW50XHJcbn1cclxuIiwi77u/aW1wb3J0IHsgVGFibGVQYXJzZXIgfSBmcm9tIFwiLi9UYWJsZVBhcnNlckFzeW5jXCI7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy9kbyB3b3JrXHJcbiAgICAvL3RhYmxlVmlld3MgPSBbXTtcclxuICAgIHZhciBwYXJzZXI9IG5ldyBUYWJsZVBhcnNlcigpO1xyXG4gICAgbGV0IHRhYmxlczpIVE1MQ29sbGVjdGlvbk9mPEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWxpc3QtbWFuaXB1bGF0ZV1cIikgYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MVGFibGVFbGVtZW50PjtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFibGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcGFyc2VyLnBhcnNlRnJvbUh0bWwodGFibGVzW2ldLCAxMDAwMCwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgXHRjb25zb2xlLmxvZyhcInBhcnNlZCBkYXRhXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbn0pOyJdfQ==
