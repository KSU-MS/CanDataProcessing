#include "CanNetwork.h"

// Can chip
#define CAN_CS 15
#define CAN_IRQ 14

CanNetwork can = CanNetwork(CAN_CS);

#define debug_mode true

void setup()
{

  if (debug_mode)
  {
    Serial.begin(1000000);
    // Wait for slow serial on the teensy, but only for 5 seconds max so we never get stuck here
    unsigned long timeout = millis();
    while (!Serial && millis() - timeout < 5000)
      delay(1);

    Serial.println("Setup begin...");
    Serial.println("Debug mode on.");
    can.debug();
  }

  // Init CAN system
  can.init(CAN_250KBPS);

}
unsigned long last = 0;
unsigned long lastP = 0;
void loop()
{

    // This is how you create a packet
    CanPacket packet = {timestamp : millis(), id : 10000, data : {0x1,0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8}, delim : CAN_PACKET_DELIM};
    // You can update parts of the data like this
    packet.data[0] = 10;
    packet.data[1] = 17;

    // We can get fancy and slap a 32 bit int in 4 of these bytes like this
    // Some value is a 32bit unsigned int
    uint32_t some_value = 1234567890;
    // We copy the memory from the address (& means address of this var) of some_value to the address of data, starting with the 4th byte (that's the [4]) for 4 bytes (sizeof(some_value) will return 4 because it's 4 bytes long)
    memcpy(&data[4], &some_value, sizeof(some_value));
    // Done! Now that 32 bit number is stored in the packet from [4 - 7] !

    can.send(&packet);

    delay(1000);
}
