import SerialPort, { parsers } from "serialport";
import Readline = SerialPort.parsers.Readline;
import Delimiter = SerialPort.parsers.Delimiter;

export class SerialParser extends Delimiter {
  public port: SerialPort;

  constructor(device_path: string) {
    super({ delimiter: "\n" });
    this.port = new SerialPort(device_path);
    this.port.pipe(this);
    // console.log("Is Open: ", this.port.isOpen);
    // this.parser.on("data", console.log);
    // port.write('ROBOT PLEASE RESPOND\n')
  }
}
