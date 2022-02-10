import SerialPort from "serialport";
import Delimiter = SerialPort.parsers.Delimiter;
export declare class SerialParser extends Delimiter {
    port: SerialPort;
    constructor(device_path: string);
}
