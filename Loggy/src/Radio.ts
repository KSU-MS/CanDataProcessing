
import { nRF24, RF24_PA_LOW, RF24_PA_HIGH, RF24_1MBPS } from 'nrf24'; // Load with import notation notation.

export interface RadioDataPacket {
    pipe: string, data: Buffer
}
export class Radio {
    public rf24;
    public pipe;

    constructor(ce: number, cs: number) {
        rf24 = new nrf24.nRF24(<CE gpio >, <CS gpio >);
    }
    init() {

        this.rf24.begin();

        this.rf24.config({
            PALevel: RF24_PA_LOW,
            DataRate: RF24_1MBPS,

        });

        this.pipe = this.rf24.addReadPipe("0x65646f4e31", true) // listen in pipe "0x65646f4e31" with AutoACK enabled.

        // when data arrive on any registered pipe this function is called
        this.rf24.read(function (data: Array<RadioDataPacket>, n: number) {


        }, function (isStopped, by_user, error_count) {
            // This will be if the listening process is stopped.
        });

    }

    destroy() {
        this.rf24.stopRead();

        this.rf24.destroy();
    }

}
