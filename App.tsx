import * as React from 'react';
import './App.css';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import appReducer from './components/uiManager/UIManagerReducer';
import AppContainer from './components/uiManager/AppContainer';
import thunk from 'redux-thunk'

export const store = createStore(appReducer, applyMiddleware(
    thunk // lets us dispatch() functions
))

export const dispatch = store.dispatch

class App extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
};

export default App