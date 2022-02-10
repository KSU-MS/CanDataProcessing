import {readFile} from "fs";
import {promisify} from "util";

const loadFile = promisify(readFile);

export class SignalParser {
  private signal_specs: Map<number, Array<SignalSpec>>;

  constructor() {
    this.signal_specs = new Map();
  }

  public async load_signals(path: string) {
    const file: string = await loadFile(path, { encoding: "utf-8" });
    // Shave off first line of CSV as it's the labels
    const def_lines = file.split("\n").slice(1);
    def_lines.forEach((val: string) => {
      const [
        groupId,
        name,
        start,
        size,
        signed,
        little_endian,
        scale,
        offset,
        units,
        notes,
      ] = val.split(",");
      const id = parseInt(groupId);
      const group = this.signal_specs.get(id) || [];
      const spec: SignalSpec = {
        name,
        start: parseInt(start),
        size: parseInt(size),
        signed: signed == "1",
        little_endian: little_endian== "1",
        scale: parseInt(scale),
        offset: parseInt(offset),
        units,
        notes,
      };
      group.push(spec);
      this.signal_specs.set(id, group);
    });
  }

  public parse_signals(packet: Buffer, run: number): Array<SignalArray> {
    if(!packet || packet.length < 16) return[];
    const timestamp = packet.readUInt32LE();
    const group_id = packet.readUInt16LE(4);
    const group = this.signal_specs.get(group_id);
    if (!group) {
      // console.warn(`Packet found with no matching signal group: ${group_id}`);
      return [];
    }
    try {
      return group.map((spec) =>
        SignalParser.extract_spec(packet, timestamp, spec, run)
      );
    }
    catch(e){
      console.error("Parsing error: ", e);
      return [];
    }
  }

  private static extract_spec(
    packet: Buffer,
    timestamp: number,
    spec: SignalSpec,
    run: number
  ): SignalArray {
    const raw: number = SignalParser.extract_raw(packet, spec);
    const value = raw * spec.scale + spec.offset;
    const parsed_timestamp = new Date(timestamp);
    const key = parsed_timestamp.toISOString() + "_"+ spec.name;
    // if (spec.name !== "rpm") console.log(spec.name);
    return [
      key,
      parsed_timestamp,
      spec.name,
      value,
      run,
    ];
  }

  private static extract_raw(
    packet: Buffer,
    { start, size, little_endian, signed }: SignalSpec
  ): number {
    if(size === 8){
      if (little_endian) {
        // Little Endian
        if (signed) return Number( packet.readBigInt64LE(6 + start));
        else return Number(packet.readBigUInt64LE(6 + start));
      } else {
        // Big Endian
        if (signed) return Number(packet.readBigInt64BE(6 + start));
        else return Number(packet.readBigUInt64BE(6 + start));
      }
    }
    if (little_endian) {
      // Little Endian
      if (signed) return packet.readIntLE(6 + start, size);
      else return packet.readUIntLE(6 + start, size);
    } else {
      // Big Endian
      if (signed) return packet.readIntBE(6 + start, size);
      else return packet.readUIntBE(6 + start, size);
    }
  }
}

export interface SignalSpec {
  name: string;
  start: number;
  size: number;
  signed: boolean;
  little_endian: boolean;
  scale: number;
  offset: number;
  units: string;
  notes: string;
}

export interface Signal {
  timestamp: number;
  name: string;
  value: number;
  run: number;
}
export type SignalArray = [
  key: string, // Key is a composite of the timestamp and name, this is for duplicate handling
  timestamp: Date,
  name: string,
  value: number,
  run: number,
]

// GroupID, Name, Start(Byte), Size(Bytes), Signed, Endian(0 = little), Scale, Offset, Units, Notes
