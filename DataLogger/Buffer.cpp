
#include "Buffer.h"

Buffer::Buffer()
{
  _debug = false;
  head = 0;
  tail = 0;
  dropped = 0;
  count = 0;
  current_block = nullptr;

  // Init all blocks
  memset(buffer, 0, sizeof(buffer));
}
void Buffer::debug() {
  _debug = true;
}
bool Buffer::push(CanPacket packet)
{

  if (!UpsertBlock())
  { // If there is no current block
    if (_debug)
      Serial.println("Buffer overrun. Packet dropped.");
    return false;
  }

  // Store packet in next data index
  current_block->data[data_index++] = packet;

  // Check for block full.
  if (data_index >= BLOCK_MAX_PACKETS)
  {
    if (_debug) Serial.println("  Block Full ");
    head = head < (BUFFER_SIZE_BLOCKS - 1) ? head + 1 : 0;
    // Log completed block to be written
    count++;
    // Set buffer needed
    current_block = nullptr;
  }
}
// Ensures that there is a current block, creates one if not
// Returns false if there is no space
bool Buffer::UpsertBlock()
{
  // If current block does not exist
  if (!current_block)
  {
    // If we have enough ram to store another block
    if (count < BUFFER_SIZE_BLOCKS)
    {
      // Current block is buffer + head offset
      current_block = buffer + head;
      if (_debug) {
        Serial.print("Next block at: ");
        Serial.println((int)current_block);
      }
      memcpy(current_block->delim, BLOCK_DELIM, sizeof(BLOCK_DELIM));
      data_index = 0;
    }
    else
    {
      // no buffers - count overrun
      if (dropped < 0xffffffff)
      {
        dropped++;
      }
      return false;
    }
  }
  return true;
}
String padBin(int dec) {
  String result = "";
  for (unsigned int i = 0x80; i; i >>= 1) {
    result.concat(dec  & i ? '1' : '0');
  }
  return result;
}
// Removes oldest block
void Buffer::pop()
{
  // Do not pass the head if there are no blocks buffered!
  if (count < 1) return;
  // Zero out block memory
  memset(buffer + tail, 0, sizeof(DataBlock));
  // Increment tail
  tail = tail < (BUFFER_SIZE_BLOCKS - 1) ? tail + 1 : 0;
  // Decrement number of blocks stored
  count--;
}
// Returns address of oldest block
DataBlock* Buffer::peek()
{
  return buffer + tail;
}

bool Buffer::blockReady()
{
  noInterrupts();
  bool hasBlock = count > 0;
  interrupts();
  return hasBlock;
}

void Buffer::log() {
  Serial.print("Buffer Stats::");
  Serial.print("  Addr: ");
  Serial.print((int)buffer);
  Serial.print("  Size: ");
  Serial.print(sizeof(buffer));
  Serial.print("  Blocks: ");
  Serial.print(BUFFER_SIZE_BLOCKS);
  Serial.print("  Dropped (Overflows): ");
  Serial.print(dropped);
  Serial.println();

  for (int i = 0; i < sizeof(buffer); i++) {
    byte val = ((byte*)&buffer)[i];
    Serial.print(padBin(val));

    (i % 16 == 15) ? Serial.println() : Serial.print(" ");
  }
}
