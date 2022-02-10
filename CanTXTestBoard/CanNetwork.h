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
    bool send(CanPacket* packet);
    void debug();
    CanPacket receive();
    void loopback();
    void setTime(uint32_t unix_time_seconds);

private:
    bool _debug;
    CanPacket _sent;
    MCP_CAN *_CAN;
    uint32_t millis_absolute_time_offset;
};

#endif
