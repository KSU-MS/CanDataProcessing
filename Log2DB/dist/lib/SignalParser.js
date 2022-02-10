"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalParser = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const loadFile = util_1.promisify(fs_1.readFile);
class SignalParser {
    constructor() {
        this.signal_specs = new Map();
    }
    load_signals(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield loadFile(path, { encoding: "utf-8" });
            // Shave off first line of CSV as it's the labels
            const def_lines = file.split("\n").slice(1);
            def_lines.forEach((val) => {
                const [groupId, name, start, size, signed, little_endian, scale, offset, units, notes,] = val.split(",");
                const id = parseInt(groupId);
                const group = this.signal_specs.get(id) || [];
                const spec = {
                    name,
                    start: parseInt(start),
                    size: parseInt(size),
                    signed: signed == "1",
                    little_endian: little_endian == "1",
                    scale: parseInt(scale),
                    offset: parseInt(offset),
                    units,
                    notes,
                };
                group.push(spec);
                this.signal_specs.set(id, group);
            });
        });
    }
    parse_signals(packet, run) {
        if (!packet || packet.length < 16)
            return [];
        const timestamp = packet.readUInt32LE();
        const group_id = packet.readUInt16LE(4);
        const group = this.signal_specs.get(group_id);
        if (!group) {
            // console.warn(`Packet found with no matching signal group: ${group_id}`);
            return [];
        }
        try {
            return group.map((spec) => SignalParser.extract_spec(packet, timestamp, spec, run));
        }
        catch (e) {
            console.error("Parsing error: ", e);
            return [];
        }
    }
    static extract_spec(packet, timestamp, spec, run) {
        const raw = SignalParser.extract_raw(packet, spec);
        const value = raw * spec.scale + spec.offset;
        const parsed_timestamp = new Date(timestamp);
        const key = parsed_timestamp.toISOString() + "_" + spec.name;
        // if (spec.name !== "rpm") console.log(spec.name);
        return [
            key,
            parsed_timestamp,
            spec.name,
            value,
            run,
        ];
    }
    static extract_raw(packet, { start, size, little_endian, signed }) {
        if (size === 8) {
            if (little_endian) {
                // Little Endian
                if (signed)
                    return Number(packet.readBigInt64LE(6 + start));
                else
                    return Number(packet.readBigUInt64LE(6 + start));
            }
            else {
                // Big Endian
                if (signed)
                    return Number(packet.readBigInt64BE(6 + start));
                else
                    return Number(packet.readBigUInt64BE(6 + start));
            }
        }
        if (little_endian) {
            // Little Endian
            if (signed)
                return packet.readIntLE(6 + start, size);
            else
                return packet.readUIntLE(6 + start, size);
        }
        else {
            // Big Endian
            if (signed)
                return packet.readIntBE(6 + start, size);
            else
                return packet.readUIntBE(6 + start, size);
        }
    }
}
exports.SignalParser = SignalParser;
// GroupID, Name, Start(Byte), Size(Bytes), Signed, Endian(0 = little), Scale, Offset, Units, Notes
//# sourceMappingURL=SignalParser.js.map