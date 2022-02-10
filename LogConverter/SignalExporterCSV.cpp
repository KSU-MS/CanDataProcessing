#include "SignalExporterCSV.h"

using namespace std;

SignalExporterCSV::SignalExporterCSV() : file()
{
    _debug = false;
}
void SignalExporterCSV::debug()
{
    _debug = true;
}
bool SignalExporterCSV::open(const char *path)
{
    file.open((char *)path, ios::out);
    if (file.is_open())
    {
        write_head();
        return true;
    }
    else
        return false;
}
void SignalExporterCSV::close()
{
    return file.close();
}
void SignalExporterCSV::write_head()
{
    file << "timestamp,name,value,units\n";
}
uint8_t SignalExporterCSV::write(vector<Signal> *signals)
{
    int count = 0;

    for (int i = 0; i < signals->size(); i++)
    {
        Signal signal = signals->at(i);
        file << signal.timestamp << "," << signal.name << "," << signal.value << "," << signal.units << endl;
        count++;
    }
    return count;
}