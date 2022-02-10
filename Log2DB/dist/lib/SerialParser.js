"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialParser = void 0;
const serialport_1 = __importDefault(require("serialport"));
var Delimiter = serialport_1.default.parsers.Delimiter;
class SerialParser extends Delimiter {
    constructor(device_path) {
        super({ delimiter: "\n" });
        this.port = new serialport_1.default(device_path);
        this.port.pipe(this);
        // console.log("Is Open: ", this.port.isOpen);
        // this.parser.on("data", console.log);
        // port.write('ROBOT PLEASE RESPOND\n')
    }
}
exports.SerialParser = SerialParser;
//# sourceMappingURL=SerialParser.js.map