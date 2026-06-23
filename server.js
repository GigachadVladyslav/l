require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/warehouses", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "Вкажіть назву міста" });
  }

  try {
    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiKey: process.env.NOVA_POSHTA_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityName: city
        }
      })
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ error: "Помилка API Нової пошти" });
    }

    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});