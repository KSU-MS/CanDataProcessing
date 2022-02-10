
#include "LED.h"

LED::LED(byte r, byte g, byte b)
{
  _r = r;
  _g = g;
  _b = b;
  pinMode(_r, OUTPUT);
  pinMode(_g, OUTPUT);
  pinMode(_b, OUTPUT);
}
void LED::setColor(byte r, byte g, byte b)
{
  analogWrite(_r, r);
  analogWrite(_g, g);
  analogWrite(_b, b);
}
void LED::setColor(RGB rgb)
{
  setColor(rgb.r, rgb.g, rgb.b);
}
void LED::clear()
{
  setColor(0, 0, 0);
}
void LED::tick(unsigned long t)
{
  if (_blinking && t >= _next_tick)
  {
    _blink_index++;
    if (_blink_index >= _blink_sequence.size())
      _blink_index = 0;

    _next_tick = t + _blink_sequence[_blink_index].first;
    setColor(_blink_sequence[_blink_index].second);
  }
}

void LED::error()
{
  setColor(255,0,0);
//  vector<pair<int, RGB>> sequence;
//  RGB on;
//  pair<int,RGB> step_1 (1000, on);
//  sequence.push_back(step_1);
//  RGB off;
//  pair<int,RGB> step_2 (1000, off);
//  sequence.push_back(step_2);
//  set_blink_sequence(sequence);
}
// Fires an LED sequence of flashes and never returns. Call on a fatal error
void LED::errorTrap(int code){
// Will trap and never return
  while(true){
    for(int i = 0; i<=code; i++){
        setColor(255,0,0);
        delay(500);
        setColor(0,0,0);
        delay(500);
    }
    delay(2000);
  }
}
void LED::set_blink_sequence(vector<pair<int, RGB>> sequence)
{
  _blink_sequence = sequence;
  _blink_index = 0;
  _blinking = true;
}
