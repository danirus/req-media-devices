import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

import { IDeviceData } from './Ifaces';
import { readDeviceList } from './utils';
import { StateCtx } from './contexts';
import {
  IState, Actions, NotifActionTypes, DeviceActionTypes, appReducer,
  initialUserState, initialNotifState, initialDeviceState
} from './reducers';
import Home from './pages/Home';
import About from './pages/About';
import Settings from './pages/Settings';


function App() {
  // The 'newdevs' state var is used to signal when
  // we get new devices from readDevicelist.
  const [newdevs, setNewdevs] = React.useState<IDeviceData[]>([]);

  // The timerRef is used to avoid calling the updateDevices function
  // (within the useEffect, see below) more than once within one second.
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, dispatch]: [
    IState,
    (action: Actions) => void
  ] = React.useReducer(appReducer, {
    user: initialUserState,
    notif: initialNotifState,
    device: initialDeviceState
  });

  const { notif, device } = state;

  const displayError = (error: Error) => dispatch({
    type: NotifActionTypes.SET_NOTIF,
    message: error.message
  });

  const readDevices = (data: IDeviceData[]) => setNewdevs(data);

  React.useEffect(() => {
    const { cams, mics, spks } = device;
    if (cams.length | mics.length | spks.length)
      navigator.mediaDevices.ondevicechange = () => {
        readDeviceList(displayError, readDevices);
      };
  }, [device]);

  React.useEffect(() => {
    const updateDevices = () => {
      const { cams, mics, spks } = device;
      const newCams: IDeviceData[] = [];
      const newMics: IDeviceData[] = [];
      const newSpks: IDeviceData[] = [];

      newdevs.forEach((item: IDeviceData) => {
        if (item.kind === 'videoinput') newCams.push(item);
        else if (item.kind === 'audioinput') newMics.push(item);
        else if (item.kind === 'audiooutput') newSpks.push(item);
      });

      let msg = '';
      const curTotal = cams.length + mics.length + spks.length;
      const newTotal = newCams.length + newMics.length + newSpks.length;
      dispatch({
        type: DeviceActionTypes.SET_DEVICES,
        cams: newCams, mics: newMics, spks: newSpks
      });
      setNewdevs([]);

      if (newTotal > curTotal) {
        if (newTotal - curTotal === 1)
          msg = 'There is a new I/O device available.';
        else
          msg = `There are ${newTotal - curTotal} new I/O devices available.`;
      } else if (curTotal > newTotal) {
        if (curTotal - newTotal === 1) msg = 'One device has been unplugged.';
        else
          msg = `${curTotal - newTotal} devices have been unplugged.`;
      }

      if (msg.length)
        dispatch({ type: NotifActionTypes.SET_NOTIF, message: msg });
    };

    if (!timerRef.current && newdevs.length)
      timerRef.current = global.setTimeout(() => updateDevices(), 1000);

    return () => {
      if (timerRef.current)
        global.clearTimeout(timerRef.current);
    }
  }, [newdevs, device, dispatch]);

  return (
    <StateCtx.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="container">
          <h1>This is the req-media-devs app</h1>
          <p>This app will trigger the getUserMedia call whenever the user
            clicks on the settings link below. The media devices will be
            available all over the app as they will be place in the state.</p>
          <hr />
          <h5>Status message: {notif.message}</h5>
          <hr />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
            <Route path="/settings" exact component={Settings} />
          </Switch>
        </div>
      </BrowserRouter>
    </StateCtx.Provider>
  );
}

export default App;
