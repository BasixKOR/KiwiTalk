import { AuthApiClient, TalkClient } from 'node-kakao';
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';

import MenuBar from './components/common/menubar/MenuBar';
import ChatPage from './pages/ChatPage';
import Register from './pages/DeviceRegisterPage';
import Login from './pages/LoginPage';
import configureStore from './store';
import { KnownKickoutType } from 'node-kakao/dist/packet/chat';
import UtilModules from './utils';
import Configs from './constants/Configs';
import { ReducerType } from './reducers';
import { initAuthClient, initTalkClient } from './reducers/client';
import * as os from 'os';

export interface AppTalkContext {
  client?: TalkClient;
  authClient?: AuthApiClient;
}

const store = configureStore();

export const AppContext = React.createContext<AppTalkContext>({});

export const App = (): JSX.Element => {
  const {
    talkClient,
    authClient,
    serviceClient,
  } = useSelector<ReducerType>((state) => state.client);
  const dispatch = useDispatch();
  const history = useHistory();

  // talkClient register
  useEffect(() => {
    if (!talkClient) {
      const client = new TalkClient(Configs.CLIENT);

      dispatch(initTalkClient(client));
    }
  }, [talkClient]);

  // authClient register
  useEffect(() => {
    if (!authClient) {
      (async () => {
        const uuid = await UtilModules.uuid.getUUID();

        const client = await AuthApiClient.create(
            os.hostname(),
            uuid,
            Configs.CLIENT,
        );

        dispatch(initAuthClient(client));
      })();
    }
  }, [authClient]);

  // serviceClient register
  useEffect(() => {
    if (!authClient) {
      (async () => {
        const uuid = await UtilModules.uuid.getUUID();

        const client = await AuthApiClient.create(
            os.hostname(),
            uuid,
            Configs.CLIENT,
        );

        dispatch(initAuthClient(client));
      })();
    }
  }, [authClient]);

  client.on('disconnected', (reason) => {
    if (reason !== KnownKickoutType.CHANGE_SERVER) {
      alert('disconnected. ' + reason);
    }
  });

  useEffect(() => {
    const disconnectedHandler = (reason: KnownKickoutType) => {
      if (reason === KnownKickoutType.CHANGE_SERVER) return;

      history.push('/login', { reason });
    };

    client.on('disconnected', disconnectedHandler);

    return () => {
      client.off('disconnected', disconnectedHandler);
    };
  }, []);

  let menuBar: JSX.Element | null = null;

  switch (process.platform) {
    case 'darwin': case 'cygwin': case 'win32':
      menuBar = <MenuBar/>;
      break;
  }

  return (
    <Provider store={store}>
      <div className="App">
        {menuBar}
        <AppContext.Provider
          value={{
            client,
            authClient,
          }}
        >
          <Switch>
            <Route path={'/login'} component={Login} exact/>
            <Route path={'/register'} component={Register} exact/>
            <Route path={'/chat'} component={ChatPage} exact/>
            <Route path={'*'}>
              <Redirect to={'/login'}/>
            </Route>
          </Switch>
        </AppContext.Provider>
      </div>
    </Provider>
  );
};

export default App;
