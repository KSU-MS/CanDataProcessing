#ifndef LED_h
#define LED_h
#include <Arduino.h>
#include <iostream>
#include <vector>
#include <utility>

using namespace std;

struct RGB
{
    byte r;
    byte b;
    byte g;
};

class LED
{
public:
    LED(byte r, byte g, byte b);
    void setColor(byte r, byte g, byte b);
    void setColor(RGB rgb);
    void clear();
    void error();
    void errorTrap(int code);
    void tick(unsigned long t);

private:
    byte _r;
    byte _b;
    byte _g;

    void set_blink_sequence(vector<pair<int, RGB>> sequence);
    bool _blinking;
    vector<pair<int, RGB>> _blink_sequence;
    unsigned int _blink_index;
    int _next_tick;
};

#endif
