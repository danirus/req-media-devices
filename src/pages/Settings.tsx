import React from 'react';
import { NavLink } from 'react-router-dom';

import { IDeviceData } from '../Ifaces';
import { StateCtx } from '../contexts';
import { NotifActionTypes, DeviceActionTypes } from '../reducers';
import SettingsCam from '../components/SettingsCam';


export default function Settings() {
  const [granted, setGranted] = React.useState<boolean>(false);
  const { state, dispatch } = React.useContext(StateCtx);
  const { device } = state;

  React.useEffect(() => {
    async function getUserMedia() {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream: MediaStream) => {
          stream.getTracks().forEach(track => track.stop());
          setGranted(true);
        })
        .catch((_: Error) => {
          dispatch({
            type: NotifActionTypes.SET_NOTIF,
            message: `Could not find devices.`
          });
        });
    }
    getUserMedia();
  }, [setGranted, dispatch]);

  React.useEffect(() => {
    async function fetchDeviceInfo() {
      navigator.mediaDevices
        .enumerateDevices()
        .then((data: IDeviceData[]) => {
          const cams = data.filter(i => i.kind === 'videoinput');
          const mics = data.filter(i => i.kind === 'audioinput');
          const spks = data.filter(i => i.kind === 'audiooutput');
          console.log(`dispatching cams ${JSON.stringify(cams)}`);
          dispatch({
            type: DeviceActionTypes.SET_DEVICES,
            cams: cams, mics: mics, spks: spks
          });
        })
        .catch(_ => dispatch({
          type: NotifActionTypes.SET_NOTIF,
          message: ('Could not get access to local ' +
            'audio/video devices.')
        }));
    }

    if (granted)
      fetchDeviceInfo();
  }, [granted, dispatch]);

  return (
    <React.Fragment>
      <h4>Settings</h4>
      <p>In this page we trigger the getUserMedia call to the browser, to
        find out what are the devices available for the conference. We don't
        do anything with them other than storing them in the state using the
      dispatch function.</p>
      <ul>
        <li>
          Camera devices? {
            device.cams.length
              ? (
                <ul>
                  {device.cams.map((item: IDeviceData, key) => (
                    < li key={`cam-${key}`}>{item.label}</li>
                  ))}
                </ul>
              )
              : `None so far :-(`
          }
        </li>
        <li>
          Microphone devices? {
            device.mics.length
              ? (
                <ul>
                  {device.mics.map((item: IDeviceData, key) => (
                    < li key={`mic-${key}`}>{item.label}</li>
                  ))}
                </ul>
              )
              : `None so far :-(`
          }
        </li>
        <li>
          Speaker devices? {
            device.spks.length
              ? (
                <ul>
                  {device.spks.map((item: IDeviceData, key) => (
                    < li key={`spk-${key}`}>{item.label}</li>
                  ))}
                </ul>
              )
              : `None so far :-(`
          }
        </li>
      </ul>
      <div className="pb">
        { device.cams.length ? <SettingsCam /> : null }
        <hr />
        <NavLink to="/">Home</NavLink>
      </div>
    </React.Fragment>
  );
};
