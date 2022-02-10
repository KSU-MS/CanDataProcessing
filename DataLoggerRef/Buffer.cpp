
#include "Buffer.h"

Buffer::Buffer(int size)
{
  debug = false;
  head = 0;
  tail = 0;
  dropped = 0;
  count = 0;
  current_block = nullptr;

  // Init all blocks
  memset(buffer, 0, sizeof(buffer));
}
bool Buffer::Push(CanPacket packet)
{

  if (!UpsertBlock())
  { // If there is no current block
    dropped++;
    if (debug)
      Serial.println("Buffer overrun. Packet dropped.");
    return false;
  }

  // Store packet in next data index
  current_block->data[data_index++] = packet;

  // Check for buffer full.
  if (data_index >= BLOCK_MAX_PACKETS)
  {
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
      current_block = buffer + (head * BLOCK_SIZE_BYTES);
    }
    else
    {
      // no buffers - count overrun
      if (dropped < 0xffffffff)
      {
        dropped++;
      }
      return;
    }
  }
  return true;
}

DataBlock Buffer::Pop()
{
}