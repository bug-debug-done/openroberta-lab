// This file is automatically generated by the Open Roberta Lab.
#define _ARDUINO_STL_NOT_NEEDED
#include "SenseBoxMCU.h"
#undef max
#undef min
#include <NEPODefs.h>

#include <bsec.h>
#define _readIaq(X, Y) ((X.run()) ? Y : Y)
#include <Wire.h>




Bsec _iaqSensor_E;

void setup()
{
    
    Wire.begin();
    _iaqSensor_E.begin(BME680_I2C_ADDR_PRIMARY, Wire);
    bsec_virtual_sensor_t _sensorList[10] = {
        BSEC_OUTPUT_RAW_TEMPERATURE,
        BSEC_OUTPUT_RAW_PRESSURE,
        BSEC_OUTPUT_RAW_HUMIDITY,
        BSEC_OUTPUT_RAW_GAS,
        BSEC_OUTPUT_IAQ,
        BSEC_OUTPUT_STATIC_IAQ,
        BSEC_OUTPUT_CO2_EQUIVALENT,
        BSEC_OUTPUT_BREATH_VOC_EQUIVALENT,
        BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE,
        BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY,
    };
    _iaqSensor_E.updateSubscription(_sensorList, 10, BSEC_SAMPLE_RATE_LP);
}

void loop()
{
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.temperature));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.humidity));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.pressure));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.iaq));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.iaqAccuracy));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.co2Equivalent));
    Serial.println(_readIaq(_iaqSensor_E,_iaqSensor_E.breathVocEquivalent));
}