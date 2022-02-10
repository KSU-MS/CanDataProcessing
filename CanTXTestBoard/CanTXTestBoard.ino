#include "CanNetwork.h"
#include <U8g2lib.h>
#include <U8x8lib.h>
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /* clock=*/ 15, /* data=*/ 4, /* reset=*/ 16);

// ESP32 OLED WiFi Kit onboard LED
#define LED_PIN 25
// ESP32 OLED WiFi Kit "PRG" button for input to programs
#define PRG_BUTTON_PIN 0

// Can chip
#define CAN_CS 5
#define CAN_IRQ 2

CanNetwork can = CanNetwork(CAN_CS);

#define debug_mode true

void setup()
{

  if (debug_mode) {

    Serial.begin(115200);

    // Pad several lines to mark a fresh boot
    for (byte i = 0; i < 16; i++) Serial.println();

    Serial.println("Setup begin...");
    Serial.println("Debug mode on.");

    u8g2.begin();
//    u8g2.setFont(u8g2_font_10x20_mf); // fairly small font
    u8g2.setFont(u8g2_font_fub17_tf); // fairly small font
//    u8g2.setFontRefHeightExtendedText();
    u8g2.setDrawColor(1); // normal, not inverted
    u8g2.setFontPosTop(); // x,y is at top of font
  //  u8g2.setDisplayRotation(U8G2_R1); // Rotate 90
//    u8g2.setFontDirection(0); // not rotated
    u8g2.drawStr(0, 0, "Init");
    u8g2.sendBuffer();

//        can.debug();
  }



  can.init(CAN_250KBPS);
//  can.loopback();
  


  Serial.println("Setup complete.");
    u8g2.drawStr(0, 0, "ISetup complete.");
    u8g2.sendBuffer();

}
bool act = false;
unsigned long last = 0;
unsigned long lastP = 0;
int packets = 0;
int sent = 0;
int failed = 0;
void loop()
{

 if (micros() > lastP) {
    CanPacket packet = {timestamp : millis(), id : 10000, data : {0x1,0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8}, delim : CAN_PACKET_DELIM};
    bool success = can.send(&packet);
    if(success) sent++;
    else failed++;
    packets++;
   lastP = micros() + 100000;
 }


  if (millis() - last > 1000) {

    u8g2.clearBuffer();
    Serial.println(packets);
    
    char buf[30];
    sprintf(buf,"%d / %d",sent,packets);
    
    u8g2.drawStr(0, 0, buf);
//    u8g2.drawStr(0, 20, "pps");
    u8g2.sendBuffer();

    last = millis();
    packets = 0;
    sent = 0;
    failed = 0;
  }
}
