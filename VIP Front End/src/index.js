import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';
// import { store } from './app/store';
// import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import "assets/styles/bootstrap.min.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";
import { VisionUIControllerProvider } from "context";
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'

function getLibrary(provider) {
    var library;
  
    if (provider?.chainType === 'hmy') {
      library = provider.blockchain
    } else {
      library = new Web3Provider(provider)
      library.pollingInterval = 8000
    }
  
    return library
}
  

ReactDOM.render(
    <React.StrictMode>
        {/* <Provider store={store}> */}
        <Router>
            <VisionUIControllerProvider>
                <ThemeProvider theme={theme}>
                    <Web3ReactProvider getLibrary={getLibrary}>
                        <App />
                    </Web3ReactProvider>
                </ThemeProvider>
            </VisionUIControllerProvider>
        </Router>
        {/* </Provider> */}
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
