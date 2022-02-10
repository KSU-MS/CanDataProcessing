// demo: CAN-BUS Shield, send data
#include "mcp_can.h"
#include <SPI.h>

#define REC_INT 26

#define BAUD CAN_100KBPS
MCP_CAN CAN0(5);   
MCP_CAN CAN1(2); 

void setup(){
  
  Serial.begin(115200);
  delay(5000);
  Serial.println("Serial Init");
  
  init_send();
  init_rec();
  delay(100);
}
void loop(){
  send();
  rec();
}
  

void init_send()
{
  // init can bus, baudrate: 500k
  if(CAN0.begin(CAN_200KBPS) == CAN_OK) Serial.print("Send init ok!!\r\n");
  else Serial.print("Send init fail!!\r\n");
//  CAN0.mcp2515_setCANCTRL_Mode(MODE_ONESHOT);
}

unsigned char stmp[8] = {0, 1, 2, 3, 4, 5, 6, 7};
unsigned long send_time = 0;
void send()
{
  if(send_time ==0) send_time = millis() + 1000;
  if(millis() < send_time) return;
  else send_time = millis() + 1000;
  // send data:  id = 0x00, standrad flame, data len = 8, stmp: data buf
  byte sndStat = CAN0.sendMsgBuf(0x0, 0, 8, stmp);
  if(sndStat == CAN_OK){
    Serial.println("Message Sent Successfully!");
  } else {
    Serial.print("Error Sending Message, Stat: ");
    Serial.print(sndStat,BIN);
    Serial.print(" CheckErr: ");
    Serial.print(CAN0.checkError(),BIN); 
    Serial.println();
  }
}



long unsigned int rxId;
unsigned char len = 0;
unsigned char rxBuf[8];


void init_rec()
{
  pinMode(REC_INT, INPUT_PULLUP);        
  if(CAN1.begin(BAUD) == CAN_OK) Serial.print("Receive init ok!!\r\n");
  else Serial.print("Receive init fail!!\r\n");
                     
}

void rec()
{
    if(!digitalRead(REC_INT))                         // If pin 2 is low, read receive buffer
    {
      CAN1.readMsgBuf(&len, rxBuf);              // Read data: len = data length, buf = data byte(s)
      rxId = CAN1.getCanId();                    // Get message ID
      Serial.print("Received: ID: ");
      Serial.print(rxId, HEX);
      Serial.print("  Data: ");
      for(int i = 0; i<len; i++)                // Print each byte of the data
      {
        if(rxBuf[i] < 0x10)                     // If data byte is less than 0x10, add a leading zero
        {
          Serial.print("0");
        }
        Serial.print(rxBuf[i], HEX);
        Serial.print(" ");
      }
      Serial.println();
    }
}
