import express from "express";
import { config as dotenvConfig } from "dotenv";
import { connectToMongo } from "./db.js";
import cors from "cors";
import axios from "axios";
import qs from "qs";
import cheerio from "cheerio"; // Added cheerio for HTML parsing
import student from "./schema/studentData.js";

dotenvConfig();
const db = connectToMongo();
const app = express();
const port = 6969;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL2],
    methods: ["GET", "POST", "UPDATE", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.get("/getStudentsData", async (req, res) => {
  try {
    console.log("inside getStudentData");
    const studentsData = await student.find({}).sort({ rank: 1 });
    res.status(200).json(studentsData);
  } catch (error) {
    console.error("Error fetching students data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/scrapeAndSaveData", async (req, res) => {
  const startRollNo = 241190909642;
  const endRollNo = 241190910000;

  try {
    for (let rollno = startRollNo; rollno <= endRollNo; rollno++) {
      const data = qs.stringify({
        _token: "BVSQpvzmkYn9VaKnYluZNE0FlCKo9jlg0gvcvAm3",
        rollno: rollno.toString(),
      });
      console.log("current rollNo: ", rollno);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://acpc.gujarat.gov.in/merit_list_d2d_view',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9,da;q=0.8',
          'Cache-Control': 'max-age=0',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'XSRF-TOKEN=eyJpdiI6IjUxbFViZTJ1eFBFZmlHT0diU1VNbmc9PSIsInZhbHVlIjoicXdRMzAxaStoR0NkdHd6dVVxMy8wWVNTOUdMTEMrVHVSdVAwbXFSQlBsNmtVOUJmNmEzSnA4N0dzOUxIeG41VXNMWnpVNWtHYk05TjNIbG5GMkwxTGlWcTgvK04veE5mZVNGbGRyam5HenZZK3F3RFFsMEJPWGRFcjVSZlhyTTkiLCJtYWMiOiIyOTgxZWRiYWY1OTExNTI5ZmI0Nzk0MDUyNjA5M2VjYjllMjdkMzVhM2M2NGEyNzI0NjYyNWQyOTc2ZmY4MDE5In0%3D; nexelit_session=eyJpdiI6Ikl1NTZCVHhsSUlCc0hocWVPdEZ3eEE9PSIsInZhbHVlIjoiWTVJa0tETnZhMlpQNXk3ODdpcDRNWFB5b3NBZ2VIT2ppdElkcVZjYVpaZUNQL2JTK2pLMXJwRC9KaEErdzJnK2M5RjI2Z0ljb2RKRmJkVWF2MUlFbFh1aExMUFBqVnVLOWJaOHNxZm0wTFlSZFEydTFWWDk1cUo3Q21RbThlbG0iLCJtYWMiOiJlYzdjOTFkYjVlYzhmZGRiOTZlZjI4ZGE4NGJjYzJmYmQ5NmRiMTkyNjdlMzQ0Zjg3OTFkN2Q4NTJmZWNkNjhkIn0%3D; XSRF-TOKEN=eyJpdiI6IkIwSlE2LzV6d2dWaDFlbWVSVDduV3c9PSIsInZhbHVlIjoiZVA5VitCSlFpbnZLbDRpMlh4UHIxU3l6MWhGcE1HRlk3SnhndTdBVWpzckhyZWJaM1lOM0loSkJSaXpTY2U3b0xuMHpBSHZQKzVkbEtDZXVhUDRhamh6bFFtdEFXR2cvYlJ0elZtVXZEWHNtTHlmOU83b2JIcjNnaENEVjYrVGMiLCJtYWMiOiJkNGVlZjU4ZTU4YzJjZGFmZDRhNTYxMDA4OGI1M2JiODIyNjdlODQ2MmU0NDQ5NjhmNDllZjg2NGM3NmM2NDU2In0%3D; nexelit_session=eyJpdiI6IlpwMHR5c0pHbzNlWHFZMk9DUzBZWWc9PSIsInZhbHVlIjoiV1pCUU4wdGV1T2k2MTFhWVVBUzJVZlIzc3p5di9YZmZ4S1FMOUtyeW93SExycXN3ZkpUQldaZmRFUkMyMkl0U0xVcHJuUTRNdE02ZFFwaVRhQnN0NS8vTW8vdUhVQ1E4cnpwZ0t4NmpZYjZaMm9XSU1ycUxWYVhaVVppRWs3SC8iLCJtYWMiOiJhYzU4NDYwZGZjZjliOTFhYzM2MDg0MjYyZjk2OWYyNjdjYjMxZjViODg5NWZmYWE3NWU3YWViNTMxNmU0MWY4In0%3D',
          'Origin': 'https://acpc.gujarat.gov.in',
          'Referer': 'https://acpc.gujarat.gov.in/merit_list_d2d',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"'
        },
        data: data
      };

      const response = await axios.request(config);

      // Extract essential data from HTML
      const htmlData = response.data;
      const $ = cheerio.load(htmlData);

      // Check for "No result found" and skip to the next roll number if found
      if (htmlData.includes("No result found.")) {
        console.log(`No result found for roll number ${rollno}. Skipping...`);
        continue;
      }

      const essentialData = {
        programme: $("tr:contains('Programme') td").eq(1).text().trim(),
        applicationNo: $("tr:contains('Application No') td").eq(1).text().trim(),
        seatNo: parseInt($("td:contains('DDCET-2024 Seat No.')").next().text().trim()),
        candidateName: $("td:contains('Name of Candidate')").next().text().trim(),
        fathersName: $("td:contains('Father’s Name')").next().text().trim(),
        marksSecured: parseInt($("td:contains('Marks Secured')").next().text().trim()),
        rank: parseInt($("td:contains('DDCET 2024 Rank')").next().text().trim()),
        userId: $("td:contains('Userid')").next().text().trim(),
      };

      // Save essential data to MongoDB
      const newStudent = new student(essentialData);
      console.log(essentialData);
      await newStudent.save();
    }

    res.json({
      message: "Data scraped and saved successfully for all students",
    });
  } catch (error) {
    console.error("Error in scraping and saving data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
