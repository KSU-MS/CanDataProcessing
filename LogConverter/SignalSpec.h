#ifndef SIGNAL_SPEC_H
#define SIGNAL_SPEC_H

struct SignalSpec
{
    char name[32]; // The name of the signal
    uint8_t start; // The byte where this signal's value begins
    uint8_t size;  // Number of bytes (including the start byte) that this signal consumes
    bool sign;     // True if this signal is signed, false if unsigned
    bool endian;   // True if this signal is big endian
    float scale;   // Multiplier to the signal against
    float offset;  // Offset to be added (or subtracted) from CAN transmitted signal
    char units[8]; // Char array containing the units this signal is recorded in
};

#endif