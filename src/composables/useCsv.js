import { ref } from 'vue';

const useCsv = () => {
    const csvToJson = ref({
        'Date/Time': 'dateTime',
        'Serial number': 'serialNumber',
        'GPS longitude [°]': 'gpsLongitude',
        'GPS latitude [°]': 'gpsLatitude',
        'Total working hours counter [h]': 'totalWorkingHoursCounter',
        'Engine speed [rpm]': 'engineSpeed' ,
        'Engine load [%]': 'engineLoad',
        'Fuel consumption [l/h]': 'fuelConsumption',
        'Ground speed gearbox [km/h]': 'groundSpeedGearbox',
        'Ground speed radar [km/h]': 'groundSpeedRadar',
        'Coolant temperature [°C]': 'coolantTemperature',
        'Speed front PTO [rpm]': 'speedFrontPto',
        'Speed rear PTO [rpm]': 'speedRearPto',
        'current gear shift []': 'currentGearShift',
        'Ambient temperature [°C]': 'ambientTemperature',
        'Parking brake status []': 'parkingBrakeStatus',
        'Transverse differential lock status []': 'transverseDifferentialLockStatus',
        'All-wheel drive status []': 'allWheelDriveStatus',
        'Actual status of creeper []': 'actualStatusOfCreeper',
    })

    const tableHeaderColumns = ref([
      'Date/Time',
      'Serial number',
      'GPS longitude [°]',
      'GPS latitude [°]',
      'Total working hours counter [h]',
      'Engine speed [rpm]',
      'Engine load [%]',
      'Fuel consumption [l/h]',
      'Ground speed gearbox [km/h]',
      'Ground speed radar [km/h]',
      'Coolant temperature [°C]',
      'Speed front PTO [rpm]',
      'Speed rear PTO [rpm]',
      'current gear shift []',
      'Ambient temperature [°C]',
      'Parking brake status []',
      'Transverse differential lock status []',
      'All-wheel drive status []',
      'Actual status of creeper []'
    ]);

    return { csvToJson, tableHeaderColumns };
};

export default useCsv;
