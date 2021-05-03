import React from 'react';
import { NavLink } from 'react-router-dom';

import { IDeviceData } from '../Ifaces';
import { StateCtx } from '../contexts';


const content = [
  { href: '/about', text: 'About' },
  { href: '/settings', text: 'Settings' },
];

export default function Home() {
  const { state } = React.useContext(StateCtx);
  const { user, device } = state;

  return (
    <React.Fragment>
      <h4>Home page</h4>
      <ul>
        <li>
          Any user? {
            user.username
              ? (`Yes -> ${user.username} :-)`)
              : `None so far :-(`
          }
        </li>
        <li>
          Chosen devices:
          <ol>
            <li>
              Camera: {(device.defs.cam !== undefined)
                ? device.defs.cam.label
                : <b>None</b>
              }
            </li>
            <li>
              Microphone: {(device.defs.mic !== undefined)
                ? device.defs.mic.label
                : <b>None</b>
              }
            </li>
            <li>
              Speaker: {(device.defs.spk !== undefined)
                ? device.defs.spk.label
                : <b>None</b>
              }
            </li>
          </ol>
        </li>
        <li>
          Camera devices? {
            device.cams.length
              ? (
                <ul>
                  {device.cams.map((item: IDeviceData, key) => (
                    <li key={`cam-${key}`}>{item.label}</li>
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
                    <li key={`mic-${key}`}>{item.label}</li>
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
                    <li key={`spk-${key}`}>{item.label}</li>
                  ))}
                </ul>
              )
              : `None so far :-(`
          }
        </li>
      </ul>
      <hr />
      <h4>Pages in this site:</h4>
      <ul>
        {content.map((item: any, key: any) => (
          <li key={key}>
            <NavLink to={item.href}>{item.text}</NavLink>
          </li>
        ))}
      </ul>
    </React.Fragment >
  );
};
