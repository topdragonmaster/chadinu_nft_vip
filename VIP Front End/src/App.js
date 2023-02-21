import React, { useEffect, useState } from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import MainLayout from 'layouts/MainLayout.js';
import BlackUserPage from 'pages/BlackUserPage/index';
import { useWeb3React } from '@web3-react/core';
import { isBlacklisted } from 'utils/contract';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const { active, account } = useWeb3React();
  const [ isBlackUser, setIsBlackUser] = useState(false);

  useEffect(async () => {
    if (active) {
      // const account = "0x370713bad42179a045c690c8f20acc7e7b78df3b";
      let _isBlacklisted = await isBlacklisted(account)
      setIsBlackUser(_isBlacklisted)
    } else {
      setIsBlackUser(false)
    }
  }, [active, account])

  return (
    <BrowserRouter>
      {!isBlackUser ? 
        (<Switch>
          {/* add routes with layouts */}
          <Route path="/" component={MainLayout}/>
          <Redirect from="*" to="/"/>
        </Switch>) :
        <BlackUserPage />
      }
      
    </BrowserRouter>
  );
}

export default App;
