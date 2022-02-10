#include "Utils.h"
#include <stdio.h>
#include <iostream>
using namespace std;

void print_bytes(void *item, int len)
{
    cout << "  ";
    for (int i = 0; i < len; i++) // print each byte as hex
    {
        if (i > 0 && i % 16 == 0)
            cout << endl
                 << "  ";
        printf("%02hhx ", ((char *)item)[i]);
    }
    cout << endl;
}
void print_bytes(const char *label, void *item, int len)
{
    cout << label << ": " << endl;
    print_bytes(item, len);
}