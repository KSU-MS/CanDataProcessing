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
    void init(INT8U speed);
    bool send(byte id, byte data[8]);
    void debug();
    CanPacket *receive();
    void loopback();

private:
    bool _debug;
    CanPacket _sent;
    CanPacket _received;
    MCP_CAN *_CAN;
};

#endif
