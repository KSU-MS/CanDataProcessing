# KSU Motorsports Data Acquisition System

## Applications

* **DataLogger** - This application runs on the viehicals onboard data acquisition computer. This ARM based board is designed to read signals sent via CANBUS and quickly log+transmit them for future or near-realtime analisys.

* **LogConverter** - 
This program parses out signals from DataLogger's files and creates useful files for the end user.


### LogConverter Application
Binary files are parsed through the following pipeline
* Parsing - `File >> DataBlocks >> CanPackets >> SignalGroups >> Signals`
* Writing - `Signal >> Output Format`


## Data Structures

### DataBlocks
Data blocks are a data structure used to format can packets for storage. This structure was designed with the following constraints / reasoning.
* Blocks are 512 bytes each which is the exact size of an SD card page. This provides efficent writing to the SD card, one full page at a time. 
* Blocks are delimited for resiliancy such that partial and/or corrupted binary files can be recovered

#### Declaration
``` c++
struct DataBlock { // 512 bytes, 16 go to start/delim, remaining to data
  byte delim[16]; // 16 Byte delim, cannot occur in data due to CAN delim
  CanPacket data[BLOCK_MAX_PACKETS]; // Each packet is 16 bytes, 31 packets
};

```
#### Delimiter  
The delimiter marks the start of each block. 
15 zero bytes cannor occur anywhere else in the file as can delimiter ` aa aa ` occurs every 14 bytes
```c++
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ff
```

#### Sample Block
``` c++
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ff // Delimiter marks the start of this block
9e 4c 3e 0c 01 00 02 03 04 05 06 07 08 09 aa aa // Can packet 1
86 50 3e 0c 01 00 02 03 04 05 06 07 08 09 aa aa // Can packet 2
...                                             // 29 Can Packets hidden for brevity 
75 aa 3e 0c 01 00 02 03 04 05 06 07 08 09 aa aa // Can packet 31

00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ff // Delimiter marks the start of the next block
```


### SignalSpec
This is a spec used for parsing a signal out of a CanPacket 

CanPackets contain exactly 8 unsigned bytes. Multiple signals can be sent via a signle packet using these signal specs. The spec allows for scaling, applying an offset, and adding metadata for each signal in a packet. This spec allows us to send anything from an 8bit int in one of the data bytes, to a 64bit value, signed, or otherwise. 

#### Declaration
``` c++
struct SignalSpec
{
    char name[32]; // The name of the signal
    uint8_t start;    // The byte where this signal's value begins
    uint8_t size;     // Number of bytes (including the start byte) that this signal consumes
    bool sign;     // True if this signal is signed, false if unsigned
    bool endian;   // True if this signal is big endian
    float scale;   // Multiplier to the signal against
    float offset;  // Offset to be added (or subtracted) from CAN transmitted signal
    char units[8]; // Char array containing the units this signal is recorded in
};
```

### Signal
This is a captured and parsed signal. A timestamp and all operations from it's spec have been applied to it. The signal is ready to be exported / consumed by the end user.

#### Declaration
``` c++
struct Signal { 
  char name[32];      // The name of the signal
  uint32_t timestamp; // The time this signal was logged
  double value;       // The value of this signal (after spec's post-processing has been applied to the raw data)
  char units[8];  // Char array containing the units this signal is recorded in 
};
```
