export interface IDeviceData {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
}

export interface IDefaultDevices {
  cam: undefined | IDeviceData;
  mic: undefined | IDeviceData;
  spk: undefined | IDeviceData;
}
