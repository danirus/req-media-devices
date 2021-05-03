import React from 'react';

import { IState, Actions } from './reducers';


interface IStateCtxProps {
  state: IState;
  dispatch: (action: Actions) => void;
}


const StateCtx = React.createContext({} as IStateCtxProps);


export { StateCtx };
