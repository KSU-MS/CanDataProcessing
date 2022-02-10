// reading an entire binary file
#include <iostream>
#include <fstream>
#include <chrono>

using namespace std;

#include <stdio.h>
#include <string.h>
#include "LogParser.h"
#include "Signal.h"
#include "SignalParser.h"
#include "SignalExporterCSV.h"

#include "Utils.h"

// File Parsing Process

// byte Parser.getSignals(Signal[]* signals);
// Match signal GroupID to can ID
// If no match, dispose, log, or alert // TODO
// For each signal in this group
// Run parseSignal();
// If parse failed, CONTINUE (Drop signal)
// Store in signals[]*
// Increment number of signals
// Return number of signals parsed

// Signal Parser.parseSignal(CanPacket * packet, SignalDef signal*)
//

// bool Parser.validateBlockSignature();
// Validate block delimiter at start of block
// Validate each can packet is 16 bytes, the last two of which are "aa aa"
// Validate size is exactly 512 bytes

int main()
{

    LogParser logParser;
    // logParser.debug();

    SignalParser signal_parser;
    // signal_parser.debug();

    SignalExporterCSV exporter;
    // exporter.debug();

    if (!signal_parser.load_specs("../SignalSpecs.csv"))
        throw "ERROR: Unable to load signal specs from file";

    if (!logParser.open("../SampleFiles/2021-05-13_2032_02.log"))
    {
        cout << "Error opening file" << endl;
        return 1;
    }

    if (!exporter.open("../SampleFiles/2021-05-13_2032_02.csv"))
    {
        cout << "Error opening output file" << endl;
    }

    auto start = std::chrono::high_resolution_clock::now();
    DataBlock block;
    unsigned long total_exported = 0;
    while (logParser.next_block(&block))
    {
        CanPacket *packets = new CanPacket[BLOCK_MAX_PACKETS];

        uint8_t num_packets = logParser.get_packets(&block, packets);

        vector<Signal> signals;
        uint8_t num_signals = 0;
        for (int i = 0; i < num_packets; i++)
        {
            num_signals += signal_parser.get_signals(packets + i, &signals);
        }
        uint8_t exported = exporter.write(&signals);
        total_exported += exported;
    }

    exporter.close();
    auto stop = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::seconds>(stop - start);

    printf("Exported %d signals in %ds\n", total_exported, duration.count());
    cout << "Clean exit (0)" << endl;
    return 0;
}