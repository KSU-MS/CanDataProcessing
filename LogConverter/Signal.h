#ifndef SIGNAL_H
#define SIGNAL_H

struct Signal
{
    char name[32];      // The name of the signal
    uint32_t timestamp; // The time this signal was logged
    double value;       // The value of this signal (after spec's post-processing has been applied to the raw data)
    char units[8];      // Char array containing the units this signal is recorded in
};

#endif