
#include "CanNetwork.h"

// The pin here is the board select pin to SPI sometimes marked (SS)
// Note: you can make this any pin, as long as it's connected to the MCP chip's SS
CanNetwork::CanNetwork(int pin) : _CAN(new MCP_CAN(pin))
{
    _debug = false;
}
void CanNetwork::debug()
{
    _debug = true;
}
void CanNetwork::init(INT8U speed)
{

START_INIT:
    // Over 256 seems to break some boards
    if (CAN_OK == _CAN->begin(speed))
    {
        if (_debug)
            Serial.println("CAN BUS Shield init ok!");
    }
    else
    {
        Serial.println("CAN BUS Shield init fail");
        Serial.println("Init CAN BUS Shield again");
        delay(10);
        goto START_INIT;
    }
}
// This is a testing mode the mcp cards can do where they recieve everything they send (loopback)
void CanNetwork::loopback()
{
    _CAN->mcp2515_setCANCTRL_Mode(MODE_LOOPBACK);
}
bool CanNetwork::send(byte id, byte data[8])
{
    byte sndStat = _CAN->sendMsgBuf(id, 0, 8, data);

    if (sndStat == CAN_OK)
    {
        if (_debug)
            Serial.println("Message Sent Successfully!");
        return true;
    }
    else
    {
        Serial.println("Error Sending Message...");
        return false;
    }
}
CanPacket *CanNetwork::receive()
{
    if (CAN_MSGAVAIL == _CAN->checkReceive()) // Check if can data is avail
    {

        _received = {
            timestamp : millis(),
            id : _CAN->getCanId(),
            data : {0, 0, 0, 0, 0, 0, 0, 0},
            delim : CAN_PACKET_DELIM
        };
        _CAN->readMsgBuf(&_received.length, _received.data); // read data,  len: data length, buf: data buf

        if (_debug)
        {

            Serial.print("ID: ");
            Serial.print(_received.id);
            Serial.print("DATA: ");
            for (int i = 0; i < _received.length; i++) // print each byte as hex
            {
                Serial.print(_received.data[i], HEX);
                Serial.print("\t");
            }
            Serial.println();

            // Check for errors reported from board
            if (CAN_CTRLERROR == _CAN->checkError())
            {
                Serial.println("Recieve Error!");
            }
        }
        return &_received;
    }
    return NULL;
}
