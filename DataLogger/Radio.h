#ifndef Radio_h
#define Radio_h

//#include "Arduino.h"
#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "CanPacket.h"

class Radio
{
public:
    Radio(int ce, int cs);
    bool init(const byte address[6] = "00001", SPIClass *spi = &SPI);
    bool send(CanPacket *packet);
    void debug();

    RF24 *_radio;
private:
    bool _debug;
};

#endif
