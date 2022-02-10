#include "LogParser.h"
#include <stdio.h>
#include <string>
#include <vector>
using namespace std;

LogParser::LogParser() : _file()
{
  _debug = false;
}
void LogParser::debug()
{
  _debug = true;
}
bool LogParser::open(const char *path)
{
  _file.open((char *)path, ios::in | ios::binary);
  return _file.is_open();
}
bool LogParser::next_block(DataBlock *block)
{

  // Read file 16 bytes at a time until we find the next DataBlock start delimiter
  // (This SHOULD be the first 16 bytes)
  // Read out 16 bytes at a time until we load the 31 can packets (each is 16 bytes)
  // Return block

  if (!_file.is_open())
    throw "ERROR: File is not open";

  int block_start = _file.tellg();
  uint8_t match = 0;

  char c;
  while (match < 16 && !_file.eof())
  {
    _file.get(c);

    if ((uint8_t)c == BLOCK_DELIM[match])
      match++;
    else if (!_file.eof())
    {
      match = 0;
      block_start++;
      _file.seekg(block_start);
    }
    else if (_debug)
    {
      cout << "End of input file." << endl;
    }
  }
  // No block found, return false
  if (match < 16)
    return false;

  // Otherwise, a match was found
  if (_debug)
    cout << "Block found at " << block_start << endl;
  const int block_size = sizeof(DataBlock);

  // Move file get read to start of block
  _file.seekg(block_start);
  // Read block contents into struct
  _file.read((char *)block, block_size);

  // Block found, return true
  return true;
}

uint8_t LogParser::get_packets(DataBlock *block, CanPacket *packets)
{
  uint8_t packet_count = 0;
  uint8_t packet_size = sizeof(CanPacket);

  // Load each valid packet into the buffer
  for (int i = 0; i < BLOCK_MAX_PACKETS; i++)
  {
    CanPacket *packet = block->data + i;
    // if (_debug)
    // {
    //   print_bytes("Found Packet: ", packet, packet_size);
    //   cout << endl;
    // }

    // If delim is valid, move into buffer and icrement count
    if (packet->delim == CAN_PACKET_DELIM)
    {
      memcpy(packets + packet_count, packet, packet_size);
      packet_count++;
    }
  }

  if (packet_count < BLOCK_MAX_PACKETS && _debug)
  {
    printf("WARN: Found %d packets. Block should have \n", packet_count);
  }
  else if (_debug)
  {
    printf("Found %d CanPacket(s) in DataBlock\n", packet_count);
  }
  // Return number of packets returned
  return packet_count;
}
