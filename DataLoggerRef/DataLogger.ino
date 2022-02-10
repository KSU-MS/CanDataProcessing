

//#include <Arduino.h>
#include "mcp_can_2.h"
#include "CanNetwork.h"

#define CAN_PIN 10

// This is my little wrapper class that makes dealing with CAN pretty simple, also keeps our .ino clean
CanNetwork network = CanNetwork(CAN_PIN);
void setup()
{
  Serial.begin(115200);
  // Prints more to the console
  network.debug();
  // Sets up can speed, other speeds are in mcp_can_2_dfs
  network.init(CAN_500KBPS);
}

void loop()
{
    CanPacket *packet = network.receive();

  if (packet) // Packet will be null if not available
  {
    // packet.data[0] | packet.data[1] <<< 8
  }
}
