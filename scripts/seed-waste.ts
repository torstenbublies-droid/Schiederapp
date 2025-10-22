import { getDb } from "../server/db";
import { wasteSchedule } from "../drizzle/schema";
import { nanoid } from "nanoid";

async function seedWasteSchedule() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  const scheduleData = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate schedule for the next 12 weeks
  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + (week * 7) + day);
      const dayOfWeek = date.getDay();
      
      // Restmüll: every Monday
      if (dayOfWeek === 1 && week % 2 === 0) {
        scheduleData.push({
          id: nanoid(),
          district: "Schieder-Schwalenberg",
          street: "Alle Straßen",
          wasteType: "Restmüll",
          collectionDate: new Date(date),
        });
      }
      
      // Biomüll: every Tuesday
      if (dayOfWeek === 2) {
        scheduleData.push({
          id: nanoid(),
          district: "Schieder-Schwalenberg",
          street: "Alle Straßen",
          wasteType: "Biomüll",
          collectionDate: new Date(date),
        });
      }
      
      // Papier: every 4 weeks on Friday
      if (dayOfWeek === 5 && week % 4 === 0) {
        scheduleData.push({
          id: nanoid(),
          district: "Schieder-Schwalenberg",
          street: "Alle Straßen",
          wasteType: "Papier",
          collectionDate: new Date(date),
        });
      }
      
      // Gelber Sack: every 4 weeks on Thursday
      if (dayOfWeek === 4 && week % 4 === 2) {
        scheduleData.push({
          id: nanoid(),
          district: "Schieder-Schwalenberg",
          street: "Alle Straßen",
          wasteType: "Gelber_Sack",
          collectionDate: new Date(date),
        });
      }
    }
  }

  try {
    for (const item of scheduleData) {
      await db.insert(wasteSchedule).values(item);
      console.log(`✓ Inserted: ${item.wasteType} on ${item.collectionDate.toLocaleDateString('de-DE')}`);
    }
    console.log(`\n✅ Successfully seeded ${scheduleData.length} waste collection dates!`);
  } catch (error) {
    console.error("Error seeding waste schedule:", error);
  }
  
  process.exit(0);
}

seedWasteSchedule();

