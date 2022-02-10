#include <iostream>
#include <fstream>
using namespace std;

int main() {
  // Create and open a text file
  ofstream MyFile("filename.bin", ofstream::out | ofstream::binary);

  ofstream MyFile2("filename.txt");

  unsigned long time = 1;
  long int id = 1;
  unsigned long long int data = 18446744073551615;

  // Write to the file

  char buffer[32] = {
    0x0,
    0x0,
    0x0,
    0x1,

    0x0,
    0x0,
    0x0,
    0x1,

    0x1,
    0x1,
    0x1,
    0x1,
    0x1,
    0x1,
    0x1,
    0x1,

    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
    0b10101010,
  };
  while (1){
  MyFile.write(buffer,sizeof(buffer));
  const char c[2] = ",";
  MyFile2 << time << c << id << c << data << endl;
  MyFile.flush();
  MyFile2.flush();

  }
  // Close the file
  // MyFile.close();
  // MyFile2.close();
}