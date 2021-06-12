import React, { useState, useContext, useCallback } from "react";
import { withRouter, Redirect } from "react-router";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../components/AuthProvider/index";
import { firebaseAuth } from "../../firebase";

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = {
  email: "",
  password: "",
};

const Register = ({ history }) => {
  const classes = useStyles();
  const [error, setDataError] = useState({});
  const [isLoading, setDataLoading] = useState(false);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("email" in fieldValues)
      temp.email = fieldValues.email ? "" : "This field is required.";

    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setDataError({});
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    validate({ [name]: value });
  };

  const handleRegister = useCallback(
    async (values) => {
      setDataLoading(true);
      try {
        await firebaseAuth.createUserWithEmailAndPassword(
          values.email,
          values.password
        );
        setDataLoading(false);
        history.push("/");
      } catch (error) {
        setDataLoading(false);
        if (error.code === "auth/email-already-in-use") {
          let error = {
            code: 400,
            message: "Email Already In Use",
          };
          setDataError(error);
        } else if (error.code === "auth/weak-password") {
          let error = {
            code: 400,
            message: "Week Password",
          };
          setDataError(error);
        } else {
          let error = {
            code: 400,
            message: "Wrong Credentials",
          };
          setDataError(error);
        }
      }
    },
    [history]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleRegister(values);
    }
  };

  const handleClear = () => {
    setDataError({});
  };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e)}
          >
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email ? true : false}
              helperText={errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password ? true : false}
              helperText={errors.password}
            />
            {error.code && error.code !== 200 && (
              <Alert severity="error">{error.message}</Alert>
            )}
            {isLoading ? (
              <Grid container justify="center">
                <CircularProgress color="primary" />
              </Grid>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
            )}
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link to="/" onClick={handleClear}>
                  {"Have an account? Login"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default withRouter(Register);
