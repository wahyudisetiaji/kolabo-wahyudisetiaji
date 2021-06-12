import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/index";
import PrivateRoute from "./components/PrivateRoute/index";

import { LoginPage, RegisterPage, HomePage } from "./container/index";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute exact path="/home" component={HomePage} />
          <Route path="/" component={LoginPage} exact />
          <Route path="/register" component={RegisterPage} exact />
          <Route path="*" component={LoginPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
