import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../firebase";
import { Grid, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  loader: {
    top: "50%",
    left: "50%",
    zIndex: "99",
    position: "absolute",
  },
}));

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return (
      <div className={classes.loader}>
        <Grid container justify="center">
          <CircularProgress color="secondary" />
        </Grid>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
