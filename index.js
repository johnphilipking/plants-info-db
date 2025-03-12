require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");
const app = express();
// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

/* GET (SELECT) REQUESTS */

app.get("/plants", async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT * FROM plants ORDER BY name`;
  res.setHeader("Access-Control-Allow-Origin", "*").json(response);
});

app.get("/plants/attributes", async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response =
    await sql`SELECT a.id AS attributeKey, a.plant_id AS plantId, a.attribute_id AS attributeId, b.attribute AS attributeName, b.attribute_type AS attributeType  FROM plants_attributes_map a LEFT JOIN plant_attributes b ON a.attribute_id=b.id ORDER BY plantId,attributeType,attributeName`;
  res.json(response);
});

app.get("/plants/compatibility", async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT * FROM plant_compatibility ORDER BY id`;
  res.json(response);
});

app.get("/", async (_, res) => {
  const response = { message: "nothing to see here!" };
  res.setHeader("Access-Control-Allow-Origin", "*").json(response);
});

/* POST (INSERT) REQUESTS  */
app.post("/plants", async (req, res) => {
  const data = req.body;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response =
    await sql`INSERT INTO plants(name,notes) values (${data.name},${data.notes})`;
    res.setHeader("Access-Control-Allow-Origin", "*").json(response);
});

app.post("/plants/attributes", async (req, res) => {
  const data = req.body;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response =
    await sql`INSERT INTO plants_attributes_map(plant_id,attribute_id) values (${data.plant_id},${data.attribute_id})`;
    res.setHeader("Access-Control-Allow-Origin", "*").json(response);
});

app.post("/plants/compatibility", async (req, res) => {
  const data = req.body;
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response =
    await sql`INSERT INTO plant_compatibility(plant_ids,compatible,notes) values (${data.plant_ids},${data.compatible},${data.notes})`;
    res.setHeader("Access-Control-Allow-Origin", "*").json(response);
});

/* PUT (UPDATE) REQUESTS  */

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
