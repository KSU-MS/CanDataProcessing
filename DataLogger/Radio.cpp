
#include "Radio.h"

// The pin here is the board select pin to SPI sometimes marked (SS)
// Note: you can make this any pin, as long as it's connected to the MCP chip's SS
Radio::Radio(int ce, int cs) : _radio(new RF24(ce, cs))
{
    _debug = false;
}
void Radio::debug()
{
    _debug = true;
}
bool Radio::init(const byte address[6] = "00001", SPIClass *spi)
{
    if (!_radio->begin(spi))
    {
        if (_debug)
            Serial.println("Error initalizing radio");
        // return false;
    }
    if (_radio->isChipConnected())
    {
        Serial.println("Chip is connected");
    }
    else
    {
        Serial.println("Chip NOT connected");
    }
    _radio->openWritingPipe(address); //Setting the address where we will send the data
    _radio->setPALevel(RF24_PA_MAX);  //You can set it as minimum or maximum depending on the distance between the transmitter and receiver.
//    _radio->setRetries(0,0);          //This sets the module as transmitter
    _radio->stopListening();          //This sets the module as transmitter

  _radio->printPrettyDetails(); // (larger) function that prints human readable data
    return true;
}
bool Radio::send(CanPacket *packet)
{
  
//  const char text[] = "Hello World";
//  _radio->write(packet, sizeof(CanPacket));
    return _radio->writeFast(packet, sizeof(CanPacket),false);
}
