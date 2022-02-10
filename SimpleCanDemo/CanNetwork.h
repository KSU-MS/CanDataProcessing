#ifndef CanNetwork_h
#define CanNetwork_h

//#include "Arduino.h"
#include <SPI.h>
#include "mcp_can_2.h"
#include "CanPacket.h"
class CanNetwork
{
public:
    CanNetwork(int pin);
    void init(uint8_t speed);
    void send(CanPacket* packet);
    void debug();
    CanPacket receive();
    void loopback();
    void setTime(uint64_t unix_time_seconds);

    MCP_CAN *_CAN;
private:
    bool _debug;
    CanPacket _sent;
    uint64_t millis_absolute_time_offset;
};

#endif
