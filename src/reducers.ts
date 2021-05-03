import { IDeviceData, IDefaultDevices } from './Ifaces';


// ----------------------------------------------------------------------
// User reducer.

export interface IUserState {
  username: string;
}

export enum UserActionTypes {
  CLEAR_USERNAME = 'CLEAR_USERNAME',
  SET_USERNAME = 'SET_USERNAME'
}

export type UserActions =
  | { type: UserActionTypes.CLEAR_USERNAME }
  | { type: UserActionTypes.SET_USERNAME, username: string }

export const initialUserState: IUserState = {
  username: ""
}

export function userReducer(state: IUserState, action: Actions) {
  switch (action.type) {
    case UserActionTypes.CLEAR_USERNAME:
      return { username: "" };
    case UserActionTypes.SET_USERNAME:
      return { username: action.username };
    default:
      return state;
  }
}


// ----------------------------------------------------------------------
// Message reducer.

export interface INotifState {
  message: string;
}

export enum NotifActionTypes {
  SET_NOTIF = 'SET_NOTIF',
}

export type NotifActions =
  | { type: NotifActionTypes.SET_NOTIF, message: string }

export const initialNotifState: INotifState = {
  message: "We are good!"
};

export function notifReducer(state: INotifState, action: Actions) {
  switch (action.type) {
    case NotifActionTypes.SET_NOTIF:
      return { message: action.message };
    default:
      return state;
  }
}


// ----------------------------------------------------------------------
// Local IO Devices reducer.

export interface IDeviceState {
  defs: IDefaultDevices;
  cams: IDeviceData[];
  mics: IDeviceData[];
  spks: IDeviceData[];
}

export enum DeviceActionTypes {
  SET_DEVICES = 'SET_DEVICES',
  SET_DEF_CAM = 'SET_DEF_CAM',
  SET_DEF_MIC = 'SET_DEF_MIC',
  SET_DEF_SPK = 'SET_DEF_SPK',
}

export type DeviceActions =
  | {
    type: DeviceActionTypes.SET_DEVICES,
    cams: IDeviceData[], mics: IDeviceData[], spks: IDeviceData[]
  }
  | { type: DeviceActionTypes.SET_DEF_CAM, cam: IDeviceData; }
  | { type: DeviceActionTypes.SET_DEF_MIC, mic: IDeviceData; }
  | { type: DeviceActionTypes.SET_DEF_SPK, spk: IDeviceData; }

export const initialDeviceState: IDeviceState = {
  defs: {
    cam: undefined,
    mic: undefined,
    spk: undefined
  },
  cams: [],
  mics: [],
  spks: []
}

export function deviceReducer(state: IDeviceState, action: Actions) {
  switch (action.type) {
    case DeviceActionTypes.SET_DEVICES:
      return {
        defs: { ...state.defs },
        cams: action.cams,
        mics: action.mics,
        spks: action.spks
      };
    case DeviceActionTypes.SET_DEF_CAM:
      return { ...state, defs: { ...state.defs, cam: action.cam } };
    case DeviceActionTypes.SET_DEF_MIC:
      return { ...state, defs: { ...state.defs, mic: action.mic } };
    case DeviceActionTypes.SET_DEF_SPK:
      return { ...state, defs: { ...state.defs, spk: action.spk } };
    default:
      return state;
  }
}


// ----------------------------------------------------------------------
// Generic reducer.

export type Actions = UserActions | NotifActions | DeviceActions;

export interface IState {
  user: IUserState;
  notif: INotifState;
  device: IDeviceState;
}

export function appReducer(state: IState, action: Actions) {
  return {
    user: userReducer(state.user, action),
    notif: notifReducer(state.notif, action),
    device: deviceReducer(state.device, action)
  };
}
