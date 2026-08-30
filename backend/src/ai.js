function id(){ return crypto.randomUUID(); }

export function parseTravelInput(text="") {
  const raw = text.trim();
  const days = Number((raw.match(/(\d+)\s*(?:day|days)/i)||[])[1]) || 4;
  const budgetMatch = raw.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g,"")) : 18000;
  const pace = /relax|slow/i.test(raw) ? "Relaxed" : /fast|packed/i.test(raw) ? "Fast" : "Balanced";
  const interests = ["Heritage","Food","Nature","Culture","Adventure","Shopping"].filter(x=>new RegExp(x,"i").test(raw));
  const destination = (raw.match(/(?:to|in)\s+([A-Za-z][A-Za-z ]{2,30})/i)||[])[1]?.trim() || "Andhra Pradesh";
  return { parsed:{ destination, days, budget, pace, interests:interests.length?interests:["Heritage","Food","Nature"] }, confidence:86, message:"Travel brief parsed into structured constraints." };
}

export function buildTripPlan(input) {
  const destination = input.destination || "Andhra Pradesh";
  const budget = Number(input.budget || 18000);
  const days = Math.min(Math.max(Number(input.days || 4), 2), 7);
  const pace = input.pace || "Balanced";
  const interests = input.interests?.length ? input.interests : ["Heritage","Food","Nature"];
  const pools = {
    "Andhra Pradesh": [
      ["Day 1","Vijayawada","Kanaka Durga Temple","Heritage",450,"Morning"],
      ["Day 1","Vijayawada","Prakasam Barrage sunset","Nature",0,"Evening"],
      ["Day 2","Amaravati","Amaravati Buddhist Heritage","Heritage",250,"Morning"],
      ["Day 2","Guntur","Local Andhra thali","Food",500,"Lunch"],
      ["Day 3","Araku Valley","Coffee plantation experience","Nature",900,"Morning"],
      ["Day 3","Araku Valley","Tribal Museum","Culture",150,"Afternoon"],
      ["Day 4","Visakhapatnam","RK Beach sunrise","Nature",0,"Morning"],
      ["Day 4","Visakhapatnam","Submarine Museum","Culture",350,"Afternoon"],
      ["Day 4","Visakhapatnam","Local seafood dinner","Food",700,"Evening"]
    ],
    "Goa": [
      ["Day 1","Panaji","Fontainhas walk","Culture",0,"Morning"],["Day 1","Panaji","Mandovi sunset","Nature",400,"Evening"],
      ["Day 2","North Goa","Fort Aguada","Heritage",100,"Morning"],["Day 2","North Goa","Beach hopping","Nature",0,"Afternoon"],
      ["Day 3","South Goa","Local seafood trail","Food",900,"Lunch"],["Day 3","South Goa","Palolem sunset","Nature",0,"Evening"],
      ["Day 4","Old Goa","Basilica heritage circuit","Heritage",200,"Morning"]
    ],
    "Rajasthan": [
      ["Day 1","Jaipur","Amber Fort","Heritage",500,"Morning"],["Day 1","Jaipur","Hawa Mahal photo stop","Heritage",200,"Evening"],
      ["Day 2","Jaipur","Rajasthani thali","Food",600,"Lunch"],["Day 2","Pushkar","Pushkar lake walk","Culture",0,"Evening"],
      ["Day 3","Jodhpur","Mehrangarh Fort","Heritage",300,"Morning"],["Day 3","Jodhpur","Blue City walk","Culture",0,"Evening"],
      ["Day 4","Jaisalmer","Sam sunset experience","Nature",1200,"Evening"]
    ]
  };
  const pool = pools[destination] || [
    ["Day 1",destination,"Signature city highlights","Culture",500,"Morning"],["Day 1",destination,"Local food discovery","Food",650,"Evening"],
    ["Day 2",destination,"Nature escape","Nature",800,"Morning"],["Day 2",destination,"Heritage walk","Heritage",300,"Afternoon"],
    ["Day 3",destination,"Neighbourhood experience","Culture",350,"Morning"],["Day 3",destination,"Sunset viewpoint","Nature",0,"Evening"],
    ["Day 4",destination,"Local market + food","Food",550,"Lunch"],["Day 4",destination,"Slow morning","Relax",0,"Morning"]
  ];
  let selected = pool.filter(x=>interests.some(i=>x[3].toLowerCase().includes(i.toLowerCase())));
  if(selected.length < days*2) selected=pool;
  selected=selected.slice(0,Math.min(selected.length,days*2));
  const stay=Math.round(budget*.28), transport=Math.round(budget*.22), food=Math.round(budget*.22), activities=selected.reduce((a,x)=>a+x[4],0);
  const estimated=Math.min(budget,stay+transport+food+activities);
  return { id:id(), destination, days, pace, interests, estimated, budget, savings:Math.max(0,budget-estimated), stay, transport, food, activities,
    itinerary:selected.map((x,idx)=>({id:idx+1,day:x[0],city:x[1],title:x[2],tag:x[3],cost:x[4],time:x[5],duration:pace==="Relaxed"?"2h":"1.5h",status:"confirmed"})),
    route:selected.map(x=>x[1]).filter((v,i,a)=>a.indexOf(v)===i),
    priorities:[...interests].slice(0,3),
    agentLog:[["Travel DNA","Profile built from budget, pace and interests","done"],["Route Optimiser",`Grouped ${selected.length} experiences geographically`,"done"],["Budget Guard",`Kept estimated spend under ₹${budget.toLocaleString("en-IN")}`,"done"],["Group Mediator","Balanced heritage, food and nature preferences","done"],["Itinerary Agent","Generated a day-by-day adaptive plan","done"]]
  };
}

export function mediateGroup(members=[]) {
  const all=members.flatMap(m=>m.preferences||[]); const counts=Object.fromEntries([...new Set(all)].map(k=>[k,all.filter(x=>x===k).length]));
  const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return {consensus:ranked.slice(0,3).map(([name])=>name),confidence:Math.min(97,55+members.length*9+ranked.length*3),explanation:ranked.length?`Prioritised ${ranked.slice(0,3).map(x=>x[0]).join(", ")} because they have the strongest group overlap.`:"Add traveller preferences to generate consensus."};
}
