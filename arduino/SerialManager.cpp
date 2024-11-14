#include "Arduino.h"
//
class Msg
{
public:
    String command;
    int id;
    long value;
    Msg()
    {
    }
    void setCommand(String _command)
    {
        command = _command;
    }
    void setId(int _id)
    {
        id = _id;
    }
    void setValue(long _value)
    {
        value = _value;
    }
};
//
class SerialManager
{
    boolean stringComplete = false;
    int currentChar = 0;
    char inputChars[30];
    String inputString = "";
    String lastCommand;
    int lastId;
    long lastValue;

public:
    SerialManager()
    {
    }
    // ------------------------------------------------------------------------------------- Serial
    Msg *read()
    {
        if (Serial.available() > 0)
        {
            char c = (char)Serial.read();
            if (c == '\n')
            {
                stringComplete = true;
            }
            else
            {
                inputString += c;
                inputChars[currentChar] = c;
                currentChar++;
            }
        }
        //
        // ----- Format of messages command:id:value
        //
        if (stringComplete == true)
        {
            Msg *msg = new Msg();
            char *strtokIndx;
            strtokIndx = strtok(inputChars, ":");
            msg->setCommand(strtokIndx);
            strtokIndx = strtok(NULL, ":");
            msg->setId(atoi(strtokIndx));
            strtokIndx = strtok(NULL, ":");
            msg->setValue(atol(strtokIndx));
            // Manual functions, don't use in processing
            for (int i = 0; i < sizeof(inputChars); i++)
            {
                inputChars[i] = ' ';
            }
            currentChar = 0;
            inputString = "";
            stringComplete = false;
            return msg;
        }
        return NULL;
    }
};
