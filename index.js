const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;
const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("Course_server");
    const courseCollection = db.collection("course");
    const myCourseCollection = db.collection("myCourse");
    const reviewCollection = db.collection("review");

    // console.log("MongoDB connected successfully!");

    // -------------------
    // GET all courses
    // -------------------
    app.get("/courses", async (req, res) => {
      try {
        const courses = await courseCollection.find().toArray();
        res.send(courses);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch courses" });
      }
    });

    app.post("/courses", async (req, res) => {
      try {
        const {
          title,
          shortDescription,
          fullDescription,
          price,
          category,
          image,
          date,
          priority,
        } = req.body;

        const newCourse = {
          title,
          shortDescription,
          fullDescription,
          price,
          category,
          image,
          date,
          priority,
        };

        // Insert into DB
        const result = await courseCollection.insertOne(newCourse);

        res.send({
          message: "Course added successfully!",
          data: result,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to add course" });
      }
    });

    // -------------------
    // GET top 6 courses
    // -------------------
    app.get("/courses/top6", async (req, res) => {
      try {
        const topCourses = await courseCollection
          .find()
          .sort({ _id: -1 }) // newest first
          .limit(6)
          .toArray();
        res.send(topCourses);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch top 6 courses" });
      }
    });

    // -------------------
    // GET single course by ID
    // -------------------
    app.get("/courses/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const course = await courseCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!course) return res.status(404).send({ error: "Course not found" });
        res.send(course);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Invalid ID or server error" });
      }
    });

    // -------------------
    // POST enroll course
    // -------------------
    app.post("/my-course", async (req, res) => {
      try {
        const { courseId, email } = req.body;
        if (!courseId || !email)
          return res.status(400).send({ error: "Missing fields" });

        const already = await myCourseCollection.findOne({ courseId, email });
        if (already) return res.status(400).send({ error: "Already enrolled" });

        const result = await myCourseCollection.insertOne({
          courseId,
          email,
          enrolledAt: new Date(),
        });

        res.send({
          message: "Enrolled successfully",
          myCourseId: result.insertedId,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to enroll" });
      }
    });

    // -------------------
    // GET my courses for a user
    // -------------------
    app.get("/my-course", async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) return res.status(400).send({ error: "Email required" });

        const myCourses = await myCourseCollection.find({ email }).toArray();
        const courseIds = myCourses.map((c) => new ObjectId(c.courseId));

        const courses = await courseCollection
          .find({ _id: { $in: courseIds } })
          .toArray();

        res.send(courses);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch my courses" });
      }
    });

    // -------------------
    // Reviews
    // -------------------
    app.post("/reviews", async (req, res) => {
      try {
        const { courseId, courseTitle, email, reviewText } = req.body;
        if (!courseId || !courseTitle || !email || !reviewText)
          return res.status(400).send({ error: "Missing fields" });

        const result = await reviewCollection.insertOne({
          courseId,
          courseTitle, // ✅ save course title
          email,
          reviewText,
          date: new Date(),
        });

        res.send({ message: "Review submitted", reviewId: result.insertedId });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to submit review" });
      }
    });

    app.get("/reviews", async (req, res) => {
      try {
        const { email, courseId } = req.query;
        const query = {};
        if (email) query.email = email;
        if (courseId) query.courseId = courseId;

        const reviews = await reviewCollection
          .find(query)
          .sort({ date: -1 })
          .toArray();
        res.send(reviews);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch reviews" });
      }
    });
    // Delete review by ID
    app.delete("/reviews/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await reviewCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res
            .status(404)
            .send({ success: false, message: "Review not found" });
        }

        res.send({ success: true, message: "Review deleted successfully" });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .send({ success: false, error: "Failed to delete review" });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Server listening on port ${port}`));
