const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Users = require("./models/Users");
const Course = require("./models/Courses");
const Offering = require("./models/Offering");
const Record = require("./models/Record");
const Registration = require("./models/Registration");

const CURRENT_TERM = "2026-1";
const DEFAULT_PASSWORD = "password123";

const coursesData = require("./seedData/courses.json");
const advisorsData = require("./seedData/advisors.json");
const studentsData = require("./seedData/students.json");

const ROOMS = ["A101", "A102", "B201", "B202", "C301", "C302"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = [
  ["09:00", "10:30"],
  ["10:45", "12:15"],
  ["13:00", "14:30"],
  ["14:45", "16:15"],
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateStudentId() {
  let studentId;
  let isUnique = false;
  while (!isUnique) {
    studentId = String(Math.floor(1000000000 + Math.random() * 9000000000));
    const existing = await Users.findOne({ studentId });
    if (!existing) isUnique = true;
  }
  return studentId;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // --- 1. Admin (only create if NO admin exists at all) ---
  const existingAdmin = await Users.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log(`Admin already exists (${existingAdmin.email}) — leaving as is.`);
  } else {
    const admin = await Users.create({
      name: "System Admin",
      email: "admin@csc220.edu",
      passwordHash,
      role: "admin",
      active: true,
    });
    console.log("Created admin:", admin.email);
  }

  // --- 2. Advisors (create only the ones missing, by email) ---
  const advisors = [];
  for (const a of advisorsData) {
    let advisor = await Users.findOne({ email: a.email });
    if (!advisor) {
      advisor = await Users.create({
        name: a.name,
        email: a.email,
        passwordHash,
        role: "advisor",
        active: true,
      });
      console.log("Created advisor:", advisor.email);
    }
    advisors.push(advisor);
  }
  // Fall back to any existing advisors in the DB if the JSON list is empty/missing
  if (advisors.length === 0) {
    const anyAdvisors = await Users.find({ role: "advisor" });
    advisors.push(...anyAdvisors);
  }

  // --- 3. Courses (create only the ones missing, by code) ---
  const courseByCode = {};
  let newCourseCount = 0;
  for (const c of coursesData) {
    let course = await Course.findOne({ code: c.code });
    if (!course) {
      course = await Course.create({
        code: c.code,
        title: c.title,
        credits: c.credits,
        department: c.department,
      });
      newCourseCount++;
    }
    courseByCode[c.code] = course;
  }
  console.log(`Courses: ${newCourseCount} created, ${coursesData.length - newCourseCount} already existed`);

  // --- 4. Students (create only the ones missing, by email) ---
  const students = [];
  let newStudentCount = 0;
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    let student = await Users.findOne({ email: s.email });
    if (!student) {
      const studentId = await generateStudentId();
      const advisor = advisors.length > 0 ? advisors[i % advisors.length] : undefined;
      student = await Users.create({
        name: s.name,
        email: s.email,
        passwordHash,
        role: "student",
        studentId,
        advisorId: advisor ? advisor._id : undefined,
        active: true,
      });
      newStudentCount++;
    }
    students.push({ doc: student, raw: s });
  }
  console.log(`Students: ${newStudentCount} created, ${studentsData.length - newStudentCount} already existed`);

  // --- 5. Records (create only if this student+course+term combo doesn't exist) ---
  let recordCount = 0;
  for (const { doc: student, raw } of students) {
    for (const r of raw.records) {
      const course = courseByCode[r.courseCode];
      if (!course || !r.term) continue;

      const exists = await Record.findOne({
        studentId: student._id,
        courseId: course._id,
        term: r.term,
      });
      if (exists) continue;

      await Record.create({
        studentId: student._id,
        courseId: course._id,
        term: r.term,
        grade: r.grade,
      });
      recordCount++;
    }
  }
  console.log(`Created ${recordCount} new completed-course records`);

  // --- 6. Offerings for the current term (create only if missing) ---
  const currentTermCodes = new Set();
  for (const { raw } of students) {
    for (const ip of raw.in_progress) currentTermCodes.add(ip.courseCode);
  }
  currentTermCodes.add("CSC102");
  currentTermCodes.add("CSC441");

  const offeringByCode = {};
  let newOfferingCount = 0;
  let sectionNum = (await Offering.countDocuments({ term: CURRENT_TERM })) + 1;
  for (const code of currentTermCodes) {
    const course = courseByCode[code];
    if (!course) continue;

    let offering = await Offering.findOne({ courseId: course._id, term: CURRENT_TERM });
    if (!offering) {
      const [startTime, endTime] = randomPick(SLOTS);
      offering = await Offering.create({
        courseId: course._id,
        term: CURRENT_TERM,
        section: String(sectionNum++),
        day: randomPick(DAYS),
        startTime,
        endTime,
        room: randomPick(ROOMS),
        instructor: advisors.length > 0 ? randomPick(advisors).name : "TBA",
        seats: 30,
        seatsTaken: 0,
        addDropOpen: true,
      });
      newOfferingCount++;
    }
    offeringByCode[code] = offering;
  }
  console.log(`Offerings: ${newOfferingCount} created`);

  // --- 7. Registrations (create only if this student+offering combo doesn't exist) ---
  let regCount = 0;
  for (const { doc: student, raw } of students) {
    for (const ip of raw.in_progress) {
      const offering = offeringByCode[ip.courseCode];
      if (!offering) continue;

      const exists = await Registration.findOne({
        studentId: student._id,
        offeringId: offering._id,
      });
      if (exists) continue;

      if (offering.seatsTaken >= offering.seats) continue;

      await Registration.create({
        studentId: student._id,
        offeringId: offering._id,
        term: CURRENT_TERM,
        status: "registered",
      });
      offering.seatsTaken += 1;
      await offering.save();
      regCount++;
    }
  }
  console.log(`Created ${regCount} new registrations`);

  console.log("\n✅ Seed complete (existing data untouched, gaps filled in).");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  mongoose.connection.close();
});