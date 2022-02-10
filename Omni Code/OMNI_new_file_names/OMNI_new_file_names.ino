#include <SD.h>
#include <TimeLib.h>
//#include <Time.h>
#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
//#include <SparkFunLSM9DS1.h> //sparkfun method
#include <Adafruit_LSM9DS1.h>
#include <Adafruit_Sensor.h> 

const int chipSelect = BUILTIN_SDCARD;

String FileName = "";
String FolderName = "";
//char fileNameToWriteTo[] = "";
char fileNameToWriteTo[]= "";
char FileNameChar[40];
char directoryNameChar[] = "";
File root;
File myFile;
File countFile;
String dataString = ""; 
//String accelString = "";

//float aX,aY,aZ,gX,gY,gZ,mX,mY,mZ;


Adafruit_LSM9DS1 lsm = Adafruit_LSM9DS1();
//LSM9DS1 imu; //sparkfun method



int LEDr = 6;
int LEDb = 8;
int LEDg = 7;
int logBlipButton = 37;




float lastTime = 0;

bool LED_state = true;
#define PRINT_CALCULATED
//#define PRINT_RAW
//#define PRINT_SPEED 10 // 250 ms between prints
//static unsigned long lastPrint = 0; // Keep track of print time

// Earth's magnetic field varies by location. Add or subtract
// a declination to get a more accurate heading. Calculate
// your's here:
// http://www.ngdc.noaa.gov/geomag-web/#declination
#define DECLINATION 5.14 // Declination (degrees) in Marietta

float millisecondtime = 0;

void LEDblink();
time_t getTeensy3Time();
void SD_Write(String dataString);

void dateTime(uint16_t* date, uint16_t* Time)
{
  *date = FAT_DATE(year(), month(), day());
  *Time = FAT_TIME(hour(), minute(), second());
}

// #######################################################################################################################################
void setup()
{
  
  pinMode(LEDr,OUTPUT);
  pinMode(LEDb,OUTPUT);
  pinMode(LEDg,OUTPUT);
  pinMode(logBlipButton,INPUT_PULLUP);
  digitalWrite(LEDr,HIGH);
  
  Serial.begin(115200);

  
  delay(3000);
  Serial.println("Initializing Board");

/* //Sparkfun method
Wire.begin();
delay(1000);
    imu.settings.accel.scale = 8;
  imu.settings.accel.highResEnable = true;


  */
  Serial.println("LSM9DS1 data read demo");
  
  // Try to initialise and warn if we couldn't detect the chip
  if (!lsm.begin())
  {
    Serial.println("Oops ... unable to initialize the LSM9DS1. Check your wiring!");
    while (1);
  }
  Serial.println("Found LSM9DS1 9DOF");
lsm.setupAccel(lsm.LSM9DS1_ACCELRANGE_4G);
lsm.setupMag(lsm.LSM9DS1_MAGGAIN_4GAUSS);
lsm.setupGyro(lsm.LSM9DS1_GYROSCALE_245DPS);

  Serial.println("Initializing SD card...");
  delay(1000);
  
  if (!SD.begin(chipSelect)) 
    {
      Serial.println("initialization failed!");
      //return;
      //while(1);
    }
  Serial.println("initialization done.");
  Serial.println("RTC Setup Begin");
  setSyncProvider(getTeensy3Time);
  if (timeStatus()!= timeSet)
    {
      Serial.println("Unable to sync with the RTC");
    } 
  else
    {
      Serial.println("RTC has set the system time");
    }
  SdFile::dateTimeCallback(dateTime);




  if(month() < 10)
    { 
      FolderName += "0";
    }

  FolderName+=String(month());

  if(day() < 10)
    { 
      FolderName += "0";
    }
  FolderName += String(day());


  //String directoryName = "/" + String(day());
  
  
  
  String directoryName = "/" + FolderName;
  
  Serial.println(directoryName);
  
  directoryName.toCharArray(directoryNameChar,directoryName.length());
  Serial.println(directoryNameChar);
  
  


  
  
if(SD.exists(directoryNameChar))
{
  root = SD.open(directoryNameChar);
  Serial.println("Directory Already Exists");
}

else
{
  SD.mkdir(directoryNameChar);
  root = SD.open(directoryNameChar);
  Serial.println("New Directory Created");
}


  //File root = SD.open("/");
  /*
  File entry;

  int fileNum = 0;
  while (true) {
    entry =  root.openNextFile();
    if (! entry) 
      {
        // no more files
        break;
      }
    fileNum++;
  }

  FileName = String(directoryName) + String(directoryName) + "-";
  FileName+=String(fileNum);
  FileName+=String(".csv ");
*/

Serial.print("Hour: ");
Serial.println(hour());
Serial.print("Directory name ");
Serial.println(directoryName);

  int timeHour = hour();
  if(timeHour < 10)
    { 
      FileName += "0";
    }



  FileName+=String(hour());
  int timeMinute = minute();
  if(timeMinute < 10)
    { 
      FileName += "0";
    }
  FileName += String(minute());
  FileName+=String(".csv ");

FileName =  String(directoryName) + "/" + String(FileName);

//FileName = "/" + String(directoryName) + "/" + String(FileName);
Serial.print("FileName:");
Serial.println(FileName);
//FolderName.toCharArray(FolderNameChar,FolderName.length());

   // Serial.println(FolderNameChar);
   // sprintf(fileNameToWriteTo, "/%s/%02d%02d.csv", FolderNameChar, hour(), minute());
    //FileName.toCharArray(FileNameChar,FileName.length());
    FileName.toCharArray(fileNameToWriteTo,FileName.length());

    Serial.println(fileNameToWriteTo);
    myFile = SD.open(fileNameToWriteTo, FILE_WRITE);
    
/*
  Serial.println(FileName);
  FileName.toCharArray(fileNameToWriteTo,FileName.length());
  Serial.println("fileNameToWriteTo");
  Serial.println(fileNameToWriteTo);
  myFile = SD.open(fileNameToWriteTo, FILE_WRITE);
  */
  if (myFile) {
        Serial.print("Log File Started");
      } else {
        // If the file isn't open, report an error:
        Serial.print("Error Starting Log File");
      }
  myFile.close();
String Labels = "Time(RTC),Time(Millis),Shock Pot FL,Shock Pot FR,Shock Pot RL,Shock Pot RR,Steering,Gyro X,Gyro Y,Gyro Z,Accel X,Accel Y,Accel Z,Mag X,Mag Y,Mag Z,LogMarker";
SD_Write(Labels);
/*
lsm6ds33.configInt1(false, false, true); // accelerometer DRDY on INT1
lsm6ds33.configInt2(false, true, false); // gyro DRDY on INT2
*/



//digitalWrite(LED_State,HIGH);

digitalWrite(LEDr,LOW);
}



// #######################################################################################################################################

void loop() 
{
LEDblink();
  
dataString = "";

 /* // sparkfun method
  imu.settings.accel.scale = 8;
  imu.settings.accel.highResEnable = true;
  imu.begin();
*/

  lsm.read();  /* ask it to read in the data */ 

  /* Get a new sensor event */ 
  sensors_event_t a, m, g, temp;

  lsm.getEvent(&a, &m, &g, &temp); 
  

  
  dataString+=String(hour())+=String(":")+=String(minute())+=String(":")+=String(second())+=String(",");
  dataString+=String(millis())+=",";



  
  dataString+=String(analogRead(A0))+= ","; // FL
  dataString+=String(analogRead(A1))+= ","; // FR
  dataString+=String(analogRead(A2))+= ","; // RL
  dataString += String(analogRead(A22)); //shock pot RR patch  location
  dataString += ",";
  dataString += String(analogRead(A7));// steering sensor
  dataString += ",";
  dataString += a.acceleration.x/9.81;
  dataString += ",";
  dataString += a.acceleration.y/9.81;
  dataString += ",";
  dataString += a.acceleration.z/9.81;
  dataString += ",";
  dataString += g.gyro.x;
  dataString += ",";
  dataString += g.gyro.y;
  dataString += ",";
  dataString += g.gyro.z;
  dataString += ",";
  dataString += m.magnetic.x;
  dataString += ",";
  dataString += m.magnetic.y;
  dataString += ",";
  dataString += m.magnetic.z;
  dataString += ",";
/*
  aX = a.acceleration.x;
  aY = a.acceleration.y;
  aZ = a.acceleration.z;
  gX = g.gyro.x;
  gY = g.gyro.y;
  gZ = g.gyro.z;
  mX = m.magnetic.x;
  mY = m.magnetic.y;
  mZ = m.magnetic.z;
  */
  //sprintf(accelString,"%d,%d,%d,%d,%d,%d,%d,%d,%d",gX,gY,gZ,aX,aY,aZ,mX,mY,mZ);
  //Serial.println(accelString);
// datastring+=accelstring;
  if(digitalRead(logBlipButton)==0)
  {
    dataString += "1000";
    
  }
  else
  {
    dataString += "0";
  }


  
  SD_Write(dataString);
  //delay(12.5);
  
  //delayMicroseconds(10);
}



// #######################################################################################################################################

void LEDblink()
{
 /* Serial.println(millis());
  Serial.println(lastTime);
  Serial.println( lastTime - millis());*/
  if((millis() - lastTime) > 1000)
  {
    LED_state = !LED_state;
    digitalWrite(LEDg,LED_state);
    lastTime = millis();
  }
 
}



// #######################################################################################################################################

void SD_Write(String dataString)
{
      File dataFile = SD.open(fileNameToWriteTo, FILE_WRITE);
      //Serial.println(fileNameToWriteTo);
      // If the data file is available, write to it:
      if (dataFile) {
        dataFile.println(dataString);
        Serial.println(dataString);
        
        
      } else {
        // If the file isn't open, report an error:
        Serial.println("Error opening SD for " + String(fileNameToWriteTo));
      }
      dataFile.close();
}
time_t getTeensy3Time()
{
  return Teensy3Clock.get();
}
/*  code to process time sync messages from the serial port   */
#define TIME_HEADER  "T"   // Header tag for serial time sync message
unsigned long processSyncMessage() {
  unsigned long pctime = 0L;
  const unsigned long DEFAULT_TIME = 1357041600; // Jan 1 2013 
  if(Serial.find(TIME_HEADER)) {
     pctime = Serial.parseInt();
     return pctime;
     if( pctime < DEFAULT_TIME) { // check the value is a valid time (greater than Jan 1 2013)
       pctime = 0L; // return 0 to indicate that the time is not valid
     }
  }
  return pctime;
}
