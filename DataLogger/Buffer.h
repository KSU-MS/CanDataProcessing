
#ifndef Buffer_h
#define Buffer_h
#include <Arduino.h>
#include "CanPacket.h"
#include "DataBlock.h"

// If not defined (Teensy and ESP32)
#ifndef RAMEND
#define RAMEND 0X40FF
#endif

#if RAMEND < 0X8FF
const int BUFFER_SIZE_BYTES = 512;
#error SRAM too small
#elif RAMEND < 0X10FF
const int BUFFER_SIZE_BYTES = 512;
#elif RAMEND < 0X20FF
const int BUFFER_SIZE_BYTES = 4 * 512;
#elif RAMEND < 0X40FF
const int BUFFER_SIZE_BYTES = 12 * 512;
#else  // RAMEND
const int BUFFER_SIZE_BYTES = 16 * 512;
#endif // RAMEND

const int BUFFER_SIZE_BLOCKS = BUFFER_SIZE_BYTES / BLOCK_SIZE_BYTES; // Blocks we can buffer in ram

class Buffer
{
public:
    Buffer();
    bool push(CanPacket packet);
    bool blockReady();
    DataBlock* peek();
    void pop();
    void debug();
    void log();

private:
    bool _debug;   // Debug flag
    byte dropped; // Number of dropped packets

    // const int BUFFER_SIZE_BYTES; // Bytes we can buffer in ram
    // const int BUFFER_SIZE_BLOCKS; // Blocks we can buffer in ram

    DataBlock buffer[BUFFER_SIZE_BLOCKS];

    DataBlock *current_block; // Pointer to current writing block
    byte data_index;          // Current index of data written to current block

    // volatile - shared between intturupts and writer
    volatile int count; // Num of completed blocks buffered
    int head;           // Only accessed by intturupts
    int tail;           // Only accessed by writer

    bool UpsertBlock();
};

#endif
