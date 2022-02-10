#include "SignalParser.h"

using namespace std;

SignalParser::SignalParser()
{
  _debug = false;
}
void SignalParser::debug()
{
  _debug = true;
}
bool SignalParser::load_specs(const char *path)
{
  // Open spec file
  ifstream file((char *)path, ios::in);
  if (!file.is_open())
    return false;

  string line;
  // Remove leading line with colunm labels
  getline(file, line);
  // Iterate through data lines
  while (getline(file, line))
  {
    // Group ID
    uint16_t group;
    // Temp spec struct to store this spec in
    SignalSpec spec;

    istringstream linestream(line);
    string buf;

    // GroupID
    getline(linestream, buf, ',');
    group = stoi(buf);

    // Name
    getline(linestream, buf, ',');
    stringstream ss_name(buf);
    ss_name >> spec.name;

    // Start
    getline(linestream, buf, ',');
    spec.start = stoi(buf);

    // Size
    getline(linestream, buf, ',');
    spec.size = stoi(buf);

    // Signed
    getline(linestream, buf, ',');
    stringstream ss_sign(buf);
    ss_sign >> spec.sign;

    // Endian
    getline(linestream, buf, ',');
    stringstream ss_endian(buf);
    ss_endian >> spec.endian;

    // Scale
    getline(linestream, buf, ',');
    spec.scale = stof(buf);

    // Offset
    getline(linestream, buf, ',');
    spec.offset = stof(buf);

    // Units
    getline(linestream, buf, ',');
    stringstream ss_units(buf);
    ss_units >> spec.units;

    // cout << line << '\n';
    if (_debug)
      printf("Loaded spec: Group: %d, Name: %s, Start: %u, Size: %u, Sign: %u, Endian: %u, Scale: %f, Offset: %f, Units: %s \n", group, spec.name, spec.start, spec.size, spec.sign, spec.endian, spec.scale, spec.offset, spec.units);
    if (spec.scale == 0)
      printf("WARNING SignalSpec ID %s has a scale of 0. This is probably a mistake as all values * 0 will be 0. Scale should be 1 if no scale is needed.\n", spec.name);
    // Push spec into group
    // Map will create the group if it does not exist, if it does, this will point to the existing spec vector
    _groups[group].push_back(spec);
  }
  file.close();
  printf("SignalParser loaded %lu groups \n", _groups.size());

  return true;
}

uint8_t SignalParser::get_signals(CanPacket *packet, vector<Signal> *signals)
{
  uint8_t signal_count = 0;
  if (!_groups.count(packet->id))
  {
    if (_debug)
      printf("No SignalSpec found for ID %hu \n", packet->id);
    return 0;
  }

  SignalSpecVector specs = _groups[packet->id];

  // Extract every signal in spec
  for (uint8_t i = 0; i < specs.size(); i++)
  {
    SignalSpec spec = specs[i];
    Signal signal = extract_signal(packet, spec);
    signals->push_back(signal);
    signal_count++;
  }

  return signal_count;
}
Signal SignalParser::extract_signal(CanPacket *packet, SignalSpec spec)
{
  // Extract value
  double value = extract_signal_value(packet->data, spec);

  // Build signal struct
  Signal signal;
  strcpy(signal.name, spec.name);
  signal.timestamp = packet->timestamp;
  signal.value = value;
  strcpy(signal.units, spec.units);

  return signal;
}

double SignalParser::extract_signal_value(uint8_t data[8], SignalSpec spec)
{
  // Invert data order to make big endian if required
  if (spec.endian)
    reverse(data + spec.start, data + spec.size);

  // Output value
  double value;

  // Signed value
  if (spec.sign)
  {
    int64_t raw = 0;
    // Copy bytes into raw
    memcpy(&raw, &data[spec.start], spec.size);
    value = raw;
    if (_debug)
      print_bytes(&raw, 8);
  }
  // Unsigned value
  else
  {
    uint64_t raw = 0;
    memcpy(&raw, &data[spec.start], spec.size);
    value = raw;
    if (_debug)
      print_bytes(&raw, 8);
  }

  // Scale and offset value
  double scaled = (spec.scale * value + spec.offset);

  if (_debug)
    printf("Extracting signal Name: %s, Start: %d, Size: %d, Raw: %f, Scale: %f, Offset: %f, Value: %f\n", spec.name, spec.start, spec.size, value, spec.scale, spec.offset, scaled);

  return scaled;
}