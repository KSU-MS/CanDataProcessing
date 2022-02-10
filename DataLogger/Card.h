
#ifndef Card_h
#define Card_h
#include <SdFat.h>
#include "Card.dfs.h"
#include "DataBlock.h"

class Card
{
public:
    Card();
    void debug();
    bool init(int cs_pin);
    void openFile(uint32_t preallocate_size);
    
    void writeBlock(DataBlock* block);
    void closeFile();

private:
    bool _debug;   // Debug flag
    static SdFs sd;
    file_t file;
    int file_num;
    uint64_t bytes_written;
    uint64_t file_size_bytes;
    void formatFilename(char filename[24], int num);
    void Card::rolloverToNewFile();
};


#endif
