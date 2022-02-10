
#ifndef SignalExporterCSV_h
#define SignalExporterCSV_h
#include <stdio.h>
#include <iostream>
#include <fstream>
#include <vector>

#include "Signal.h"

using namespace std;

class SignalExporterCSV
{
public:
    SignalExporterCSV();
    void debug();
    bool open(const char *path);
    void close();
    uint8_t write(vector<Signal> *signals);

private:
    bool _debug; // Debug flag
    ofstream file;
    void write_head();
};

#endif
