const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

admin.initializeApp({
  apiKey: "AIzaSyDt_NGXlRZBMcsKz8_0-T3EB728e2e_wHc",
  authDomain: "real-react-noob.firebaseapp.com",
  projectId: "real-react-noob",
  storageBucket: "real-react-noob.appspot.com",
  messagingSenderId: "459604020324",
  appId: "1:459604020324:web:b65c1aaeed40f95fd62371",
});
const app = express();
app.use(cors());
const movieApp = express.Router();
movieApp.use(express.json());

const db = admin.firestore();

movieApp.get("/movies", async (req, res) => {
  try {
    const movies = await db
      .collection("reviews")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.docs.map((doc) => data.push(doc.data()));
        return data;
      });
    res.send(movies);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

movieApp.get("/movie/:id", async (req, res) => {
  try {
    const movie = await db
      .collection("reviews")
      .doc(req.params.id)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        return data;
      });
    res.send(movie);
  } catch (err) {
    res.send(400).send(err.message);
  }
});
movieApp.get("/movie/:id/comments", async (req, res) => {
  try {
    const comments = await db
      .collection("reviews")
      .doc(req.params.id)
      .collection("comments")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.docs.map((doc) => data.push(doc.data()));
        return data;
      });
    res.send(comments);
  } catch (err) {
    console.log(err.message);
    res.send(400).send(err.message);
  }
});

movieApp.post("/movie/:id/comment", async (req, res) => {
  try {
    const movie = {
      title: req.body.title,
      content: req.body.content,
    };
    const movie_comment = await db
      .collection("reviews")
      .doc(req.params.id)
      .collection("comments")
      .add(movie);
    res.status(200).send(movie);
  } catch (err) {
    res.send(400).send(err.message);
  }
});

app.use(express.json());
app.use("/api", movieApp);

exports.movieAPI = functions.region("asia-northeast3").https.onRequest(app);
