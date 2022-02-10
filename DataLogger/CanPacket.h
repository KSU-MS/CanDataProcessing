#ifndef CanPacket_h
#define CanPacket_h

// Ensures there is always a 1 and 0 spaced less than 16 bytes apart
const word CAN_PACKET_DELIM = 0b1010101010101010;

struct CanPacket // 16 bytes (128 bits)
{
    uint32_t timestamp; // 32 bits (Time)
    uint16_t id;        // 16 bits (Param ID)
    byte data[8];   // 64 bits (Data)
    uint16_t delim;     // 16 bits (Delimiter between frames)
};


#endif
