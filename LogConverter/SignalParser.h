
#ifndef SignalParser_h
#define SignalParser_h
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <map>
#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <string>
#include <vector>

#include "SignalSpec.h"
#include "CanPacket.h"
#include "Utils.h"
#include "Signal.h"

using namespace std;
typedef vector<SignalSpec> SignalSpecVector;

class SignalParser
{
public:
    SignalParser();
    void debug();
    bool load_specs(const char *path);
    uint8_t get_signals(CanPacket *packet, vector<Signal> *signals);

private:
    bool _debug; // Debug flag
    map<uint16_t, SignalSpecVector> _groups;
    Signal extract_signal(CanPacket *packet, SignalSpec spec);
    double extract_signal_value(uint8_t data[8], SignalSpec spec);
};

#endif
