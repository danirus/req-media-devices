import { IDeviceData } from './Ifaces';


function readDeviceList(
  onError: (error: Error) => void,
  onSuccess: (devices: IDeviceData[]) => void,
) {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function(devices: IDeviceData[]) {
      onSuccess(devices);
    })
    .catch((error: Error) => {
      onError(error);
    });
}

export { readDeviceList };
