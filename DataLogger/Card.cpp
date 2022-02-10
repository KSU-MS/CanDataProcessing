
#include "Card.h"

#include <TimeLib.h>


SdFs Card::sd;
Card::Card()
{
  file_num = 1;
}
bool Card::init(int cs_pin)
{
#if HAS_SDIO_CLASS
#define SD_CONFIG SdioConfig(FIFO_SDIO)
#elif ENABLE_DEDICATED_SPI
#define SD_CONFIG SdSpiConfig(cs_pin, DEDICATED_SPI, SD_SCK_MHZ(16))
#else  // HAS_SDIO_CLASS
#define SD_CONFIG SdSpiConfig(cs_pin, SHARED_SPI, SD_SCK_MHZ(16))
#endif  // HAS_SDIO_CLASS
  if (!sd.begin(SD_CONFIG))
  {
    sd.initErrorHalt(&Serial);
    return false;
  }
  return true;
}
void Card::debug()
{
  _debug = true;
}

void Card::openFile(uint32_t size_mb)
{
  file_size_bytes = size_mb << 20;

  file.close();
  char filename[24];
  formatFilename(filename,file_num++);

  if (_debug)
  {
    Serial.print("Creating file ");
    Serial.println(filename);
  }
  while (sd.exists(filename))
  {
    if (_debug)
    {
      Serial.print("File ");
      Serial.print(filename);
      Serial.println(" exists.");
    }
    formatFilename(filename,file_num++);
    if (_debug)
    {
      Serial.print("Creating file ");
      Serial.println(filename);
    }
  }
  if (!file.open(filename, O_RDWR | O_CREAT))
  {
    Serial.println("open file failed");
  }
  if (_debug)
    Serial.println(filename);

  if (!file.preAllocate(file_size_bytes))
  {
    Serial.println("preAllocate failed");
  } else if (_debug) {
    Serial.print("preAllocated: ");
    Serial.print(size_mb);
    Serial.println(" MB");
  }
}

void Card::formatFilename(char filename[24], int num)
{
  // Set time lib from rtc
  setSyncProvider(Teensy3Clock.get);

  // Date format yyyy-mm-dd_hh_mm
  sprintf(filename, "%04d-%02d-%02d_%02d%02d_%02d.log", year(), month(), day(), hour(), minute(),num);
  
}
void Card::writeBlock(DataBlock *block)
{
  int dataSize = sizeof(DataBlock);
  if (dataSize + bytes_written > file_size_bytes) {
    rolloverToNewFile();
  }
  int bytes = file.write(block, sizeof(DataBlock));
  if (_debug)
  {

    Serial.print("Wrote ");
    Serial.print(bytes);
    Serial.println(" bytes to card.");
  }
  if (bytes != sizeof(DataBlock))
  {
    Serial.println("Error writing block");
  }
  bytes_written += bytes;
  file.flush();
}
// Create a new file, trucate old one, increment file num
void Card::rolloverToNewFile() {
  file.truncate();
  openFile(file_size_bytes << 20);
}
void Card::closeFile()
{
  file.truncate();
  file.close();
}
