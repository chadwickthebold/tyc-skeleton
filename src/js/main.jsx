/*
 * Application entry point
 */
 /* global require */


import React from 'react';
import App from './models/App';
import AppView from './components/AppView';

require("../styles/styles.less");

(function() {
    'use strict';

    var app = new App({message: "Hello, World! This is tyc-skeleton."});
    var container = document.getElementById('app-container');

    React.render(
        <AppView
        app = {app}
        >
        </AppView>,
        container
    );

})();

