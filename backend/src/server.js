import express from "express";
import cors from "cors";
import morgan from "morgan";
import { buildTripPlan, mediateGroup, parseTravelInput } from "./ai.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "TripBuddy API", version: "2.0" }));

app.post("/api/trips/plan", (req, res) => {
  try { res.json({ ok: true, plan: buildTripPlan(req.body || {}) }); }
  catch (e) { res.status(400).json({ ok: false, message: e.message }); }
});

app.post("/api/input/parse", (req, res) => {
  res.json({ ok: true, ...parseTravelInput(req.body?.text || "") });
});

app.post("/api/group/mediate", (req, res) => {
  res.json({ ok: true, ...mediateGroup(req.body?.members || []) });
});

app.post("/api/trips/self-heal", (req, res) => {
  const { itinerary = [], disruption = "Heavy rain + 70 min delay" } = req.body || {};
  const next = itinerary.map((item, i) => i === 1
    ? { ...item, status: "rescheduled", note: `${disruption} detected — moved to flexible slot`, weather: "Rain" }
    : { ...item, status: "confirmed" }
  );
  res.json({ ok: true, disruption, message: "Itinerary repaired without losing the trip's high-priority experiences.", itinerary: next });
});

app.post("/api/bookings/quote", (req, res) => {
  const { destination = "Andhra Pradesh", budget = 18000 } = req.body || {};
  const base = Number(budget);
  res.json({ ok: true, quotes: [
    { type:"Flight", provider:"TripBuddy Air", detail:`Round trip to ${destination}`, price:Math.round(base*.24), badge:"Best value" },
    { type:"Stay", provider:"TripBuddy Stays", detail:"4-star · breakfast included", price:Math.round(base*.28), badge:"Recommended" },
    { type:"Dining", provider:"TripBuddy Tables", detail:"3 curated reservations", price:Math.round(base*.12), badge:"AI curated" }
  ]});
});

app.post("/api/split", (req, res) => {
  const total = Number(req.body?.total || 0);
  const members = req.body?.members || [];
  const weights = members.map((_,i)=> i===0 ? 1.15 : 1);
  const sum = weights.reduce((a,b)=>a+b,0) || 1;
  let assigned = 0;
  const split = members.map((name,i)=>{
    const amount = i===members.length-1 ? total-assigned : Math.round(total*weights[i]/sum);
    assigned += amount;
    return { name, amount, status:"pending" };
  });
  res.json({ ok:true, total, currency:"INR", split });
});

app.get("/api/demo/weather", (_, res) => res.json({ ok:true, location:"Andhra Pradesh", forecast:[
  {day:"Today", icon:"☀️", temp:31, rain:10, label:"Clear"},
  {day:"Tomorrow", icon:"🌦️", temp:29, rain:62, label:"Scattered rain"},
  {day:"Day 3", icon:"⛅", temp:30, rain:28, label:"Partly cloudy"}
]}));

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`TripBuddy API running on http://localhost:${port}`));
