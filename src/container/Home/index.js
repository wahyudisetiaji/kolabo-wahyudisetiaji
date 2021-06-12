import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Typography,
  Toolbar,
  Grid,
  CssBaseline,
  Card,
  CardContent,
  CardHeader,
  Button,
  AppBar,
  Container,
  IconButton,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { firebaseAuth, taskCollection } from "../../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardText: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  create: {
    width: "100%",
    marginBottom: "50px",
  },
  task: {
    padding: "5px",
  },
}));

const initialValues = {
  task: "",
};

export default function Album() {
  const classes = useStyles();
  const history = useHistory();
  const [dataId, setDataId] = useState("");
  const [state, setState] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    taskCollection.onSnapshot(function (querySnapshot) {
      let data = [];
      querySnapshot.forEach(function (doc) {
        let obj = doc.data();
        setDataId(doc.id);
        data.push(obj.data);
      });
      setState(data[0]);
    });
  }, []);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("task" in fieldValues)
      temp.task = fieldValues.task ? "" : "This field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    validate({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      let obj = {
        id: v4(),
        name: values.task,
      };
      state[0].items.push(obj);
      setValues({ task: "" });
      taskCollection.doc(dataId).update({ data: state });
    }
  };

  const handleDelete = (droppableId, draggableId) => {
    let dataNew = state;
    let destinationId = generateKey(droppableId);
    let sourceIndex = 0;
    state[destinationId].items.forEach((element, idx) => {
      if (element.id === draggableId) {
        sourceIndex = idx;
      }
    });
    dataNew[destinationId].items.splice(sourceIndex, 1);
    taskCollection.doc(dataId).update({ data: dataNew });
  };

  const generateKey = (key) => {
    switch (key) {
      case "todo":
        return 0;
      case "in-progress":
        return 1;
      case "done":
        return 2;
      default:
    }
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    let destinationId = generateKey(destination.droppableId);
    let sourceId = generateKey(source.droppableId);

    // data yang akan dipindahkan
    const itemCopy = state[sourceId].items[source.index];

    let dataNew = state;

    // hapus ke lokasi task baru
    dataNew[sourceId].items.splice(source.index, 1);

    // tambah ke lokasi task baru
    dataNew[destinationId].items.splice(destination.index, 0, itemCopy);

    taskCollection.doc(dataId).update({ data: dataNew });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    firebaseAuth.signOut();
    history.push("/");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Kolabo - Wahyudi Setiaji
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid}>
          <Grid container justify="center" className={classes.create}>
            <form
              className={classes.form}
              autoComplete="off"
              onSubmit={(e) => handleSubmit(e)}
            >
              <TextField
                variant="outlined"
                margin="normal"
                id="task"
                label="Create Task"
                name="task"
                fullWidth
                value={values.task}
                onChange={handleInputChange}
                error={errors.task ? true : false}
                helperText={errors.task}
              />
            </form>
          </Grid>
          <Grid container spacing={2} justify="space-around">
            <DragDropContext onDragEnd={handleDragEnd}>
              {state.map((data, idx) => {
                return (
                  <Grid item key={data.key} xs={12} sm={6} md={3}>
                    <Card className={classes.card}>
                      <CardHeader
                        title={data.title}
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                        style={{ backgroundColor: data.color }}
                      />
                      <CardContent>
                        <Droppable droppableId={data.key}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {data.items.map((el, index) => {
                                  return (
                                    <Draggable
                                      key={el.id}
                                      index={index}
                                      draggableId={el.id}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div className={classes.task}>
                                            <Alert
                                              className={`item ${
                                                snapshot.isDragging &&
                                                "dragging"
                                              }`}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              icon={false}
                                              severity="warning"
                                              onClose={() =>
                                                handleDelete(data.key, el.id)
                                              }
                                            >
                                              {el.name}
                                            </Alert>
                                          </div>
                                        );
                                      }}
                                    </Draggable>
                                  );
                                })}

                                {provided.placeholder}
                              </div>
                            );
                          }}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </DragDropContext>
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
