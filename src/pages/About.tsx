import React from 'react';
import { NavLink } from 'react-router-dom';

import { StateCtx } from '../contexts';
import { UserActionTypes } from '../reducers';


export default function About() {
  const { state, dispatch } = React.useContext(StateCtx);
  const { device, user } = state;

  const [name, setName] = React.useState<string>(user.username);

  React.useEffect(() => {
    console.log(`About: device=${JSON.stringify(device)}`);
  }, [device]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value as string);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Submitting form with: ${name}`);
    dispatch({ type: UserActionTypes.SET_USERNAME, username: name });
  }

  return (
    <React.Fragment>
      <h4>About {name}</h4>
      <form onSubmit={handleSubmit}>
        User:&nbsp;
        <input type="text" value={name} onChange={handleChange} />
        &nbsp;<input type="submit" value="Save" />
      </form>
      <hr />
      <NavLink to="/">Home</NavLink>
    </React.Fragment>
  );
};
