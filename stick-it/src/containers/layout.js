import React, { Component } from "react";
import { NavLink, Switch, Route, Redirect } from "react-router-dom";
import Bulletin from '../containers/bulletin'
import Bulletin1 from '../containers/bulletin1'
import "./css/layout.css"
export default class Layout extends Component {
    render() {
        var socket = this.props.socket;
        return (
            <div>
                <header class="header">
                     <div class="container">
                           <div class="row">
                                 <div class="left menu-icon">
                                    <a href="#" id="hamburger-icon" title="Menu">
                                         <span class="line line-1"></span>
                                         <span class="line line-2"></span>
                                         <span class="line line-3"></span>
                                    </a>
                                 </div>	
                           <ul class="menu right">
                              <li><a href=""><NavLink to="/home">Post-it Theme</NavLink></a></li>
                              <li><a href=""><NavLink to="/home1">Paper Theme</NavLink></a></li>
                            </ul>
                          </div>
                      </div>
                 </header>
                {/* <!-- END .header --> */}
                <Switch>
                    <Route exact path="/home1" component={() => <Bulletin1 socket={socket} />} />
                    <Route path="/home" component={() => <Bulletin socket={socket} />} />
                    <Redirect from="/" to="/home" />
                </Switch>

            </div>
        );
    }
}
