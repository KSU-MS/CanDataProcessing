// Data blocks are used for buffer storage

#ifndef DataBlock_h
#define DataBlock_h

#include "CanPacket.h"

// SD card pages are 512 Bytes
const uint16_t BLOCK_SIZE_BYTES = 512; // Bytes
// Num packets that can be stored (Block Size - start&delim) / PacketSize
const byte BLOCK_MAX_PACKETS = (BLOCK_SIZE_BYTES - 16*sizeof(byte)) / sizeof(CanPacket);

const byte BLOCK_DELIM[16] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0xFF};

struct DataBlock { // 512 bytes, 16 go to start/delim, remaining to data
  byte delim[16]; // 16 Byte delim, cannot occur in data due to can delim
  CanPacket data[BLOCK_MAX_PACKETS]; // Each packet is 16 bytes, 28 packets
};
#endif 
