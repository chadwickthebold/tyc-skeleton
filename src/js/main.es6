/*
 * Application entry point
 */


import React from 'react';
import App from './models/App';
import AppView from './components/AppView';

require("../styles/styles.less");

(function() {

    var app = new App({message: "Hello, World! This is tyc-skeleton."});
    var newAppView = new AppView();
    var container = document.getElementById('app-container');

    React.render(
        <AppView
        app = {app}
        >
        </AppView>,
        container
    );

})();

