import React from 'react';

import { StateCtx } from '../contexts';
import { IDeviceData } from '../Ifaces';
import { DeviceActionTypes } from '../reducers';

export default function SettingsCam() {
  const { state, dispatch } = React.useContext(StateCtx);
  const { device } = state;
  const { defs } = device;

  const stopCam = React.useCallback((): void => {
    const velem: any = document.getElementById("cam");
    if (velem) {
      const stream = velem.srcObject;
      if (stream) {
        (stream as MediaStream)
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        velem.srcObject = null;
      }
    }
  }, []);

  React.useEffect(() => {
    return (): void => stopCam();
  }, [stopCam]);

  React.useEffect(() => {
    if (defs.cam !== undefined) {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: { exact: defs.cam.deviceId },
          width: { ideal: 320, max: 320 },
          height: { ideal: 240, max: 240 }
        }
      }).then((stream: MediaStream) => {
        const video_elem: any = document.getElementById("cam");
        video_elem.srcObject = stream;
      });
    }
  }, [defs.cam]);

  const handleChange = (event: React.ChangeEvent<any>): void => {
    if (event && event.target && event.target.value) {
      const cam = device.cams.filter(
        (item: IDeviceData) => item.deviceId === event.target.value
      )[0];
      console.log(`cam selected is ${JSON.stringify(cam)}`);
      dispatch({ type: DeviceActionTypes.SET_DEF_CAM, cam: cam });
    }
  }

  return (
    <React.Fragment>
      <h4>Select a default Camera:</h4>
      {device.cams.length
        ? (
          <React.Fragment>
            <select
              id="cams"
              onChange={handleChange}
              {...(defs.cam === undefined) && { defaultValue: "" }}
            >
              {defs.cam === undefined
                ? (<option value="">Choose a camera</option>)
                : null
              }
              {device.cams.map((item, key) => (
                <option key={key} value={item.deviceId}>{item.label}</option>
              ))}
            </select>
            <video id="cam" playsInline autoPlay />
          </React.Fragment>
        )
        : null
      }
      <hr />
    </React.Fragment>
  );
}
