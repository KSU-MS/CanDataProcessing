
#ifndef LogParser_h
#define LogParser_h
#include <iostream>
#include <fstream>

#include "DataBlock.h"
#include "Utils.h"
#include "Signal.h"

using namespace std;

class LogParser
{
public:
    LogParser();
    void debug();
    bool open(const char *path);
    bool next_block(DataBlock *block);
    uint8_t get_packets(DataBlock *block, CanPacket *packets);

private:
    bool _debug; // Debug flag
    ifstream _file;
};

#endif
