const express= require("express");
const cors= require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const departmentRoutes = require("./routes/departmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aboutUsRoutes = require("./routes/aboutUsRoutes")
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const eventRoutes = require("./routes/eventRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const academicRoutes = require("./routes/academicRoutes");
const errorHandler = require("./middleware/errorMiddlewares");



const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/department", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutUsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/academics", academicRoutes);

app.use(errorHandler);

module.exports=app;