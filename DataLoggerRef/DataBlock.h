// Data blocks are used for buffer storage

#ifndef DataBlock_h
#define DataBlock_h

#include "Arduino.h"
#include "CanPacket.h"

// SD card pages are 512 Bytes
const byte BLOCK_SIZE_BYTES = 128; // Bytes
// Num packets that can be stored (Block Size - start&delim) / PacketSize
const byte BLOCK_MAX_PACKETS = (BLOCK_SIZE_BYTES - 16*sizeof(byte)) / sizeof(CanPacket);

const byte BLOCK_HEAD = 0b11111111;
const byte BLOCK_DELIM[8] = {0,0,0,0,0,0,0,0};

struct DataBlock { // 128 bytes, 16 go to start/delim, remaining 112 to data
  byte start; // 1 byte start block (0b11111111) Marks the start of this block for data integrity checking and partial error correction
  CanPacket data[BLOCK_MAX_PACKETS]; // Each packet is 16 bytes, 7 packets = 112 bytes
  byte delim[15]; // 15 Byte delim (all 0's), cannot occur in data due to can delim
};
#endif 
