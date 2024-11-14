#include "SerialManager.cpp"

#include <EEPROM.h>
SerialManager *sm;
Msg *msg;

int uniq;

// -----------------------------------------------

#include <AccelStepper.h>

unsigned long time;
long clickedTime = 0;

int stepsPerRevolution = 12800;
int speedMotor = 4000;
int accelMotor = 4000;
long target = 0;

boolean isCalibrated = false;

boolean stepperIsRunning = true;
AccelStepper stepper;

void setup()
{
  Serial.begin(115200);
  sm = new SerialManager();
  Serial.println("HELLO WORLD");
}
// ----------------------------------------------- Eeprom simple exemple
void loop()
{

  stepper.setMaxSpeed(speedMotor);
  stepper.setAcceleration(accelMotor);

  msg = sm->read();
  if (msg != NULL)
  {
    Serial.println(msg->command);
    if (msg->command == "setUniq")
    {
      writeUniq(msg->value);
    }
    else if (msg->command == "getUniq")
    {
      readUnik();
    }
    else if (msg->command == "conveyor")
    {
      Serial.println("command conveyor");
      if (msg->value == 1)
      {
        Serial.println("StartConveyor");
        stepperIsRunning = true;
      }
      else if (msg->value == 0)
      {
        Serial.println("StopConveyor");
        stepperIsRunning = false;
      }
    }
    else if (msg->command == "setNewTarget")
    {
      setNewTarget(msg->value);
    }
  }

  if (!stepper.distanceToGo() == 0)
  {
    stepper.moveTo(target);
  }
  stepper.run();
}

void setNewTarget(long t)
{
  Serial.print("Current Position: ");
  Serial.println(stepper.currentPosition());
  Serial.print("new Target: ");
  Serial.println(t);
  target = t;
  stepper.moveTo(t);
}

void calibration()
{
  Serial.println("calibration");
}

// ----------------------------------------------- Eeprom simple exemple
void writeUniq(byte _uniq)
{
  uniq = _uniq;
  EEPROM.write(0, uniq);
  readUnik();
}
void readUnik()
{
  uniq = EEPROM.read(0);
  Serial.print("uniq:");
  Serial.print(0);
  Serial.print(":");
  Serial.println(uniq);
}
