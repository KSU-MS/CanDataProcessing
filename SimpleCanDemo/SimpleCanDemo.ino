#include "CanNetwork.h"

#define CAN_CS 2 // Change this to your CS pin!

CanNetwork can = CanNetwork(CAN_CS);
#define debug_mode true

void setup()
{
    // Init CAN system
    can.init(CAN_250KBPS);
    if (debug_mode)
        can.debug();
    //    can.loopback(); /// NOTE DEBUGGING - NOT FOR PROD - WILL NOT LISTEN FOR MESSAGES!!!!!!!
}

void loop()
{
    CanPacket incoming = can.receive();

//    Serial.println(); 
}
