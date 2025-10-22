import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import * as schema from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database...");

  // Mayor Info
  await db.insert(schema.mayorInfo).values({
    id: "mayor-current",
    name: "Dr. Torben Blome",
    party: "CDU",
    position: "Bürgermeister",
    email: "buergermeister@schieder-schwalenberg.de",
    phone: "05282 / 26-41",
    bio: "Bürgermeister der Stadt Schieder-Schwalenberg seit 2020",
  }).onDuplicateKeyUpdate({ set: { name: "Dr. Torben Blome" } });

  // News
  const newsItems = [
    {
      id: nanoid(),
      title: "Neuer Spielplatz am Kurpark eröffnet",
      teaser: "Die Stadt Schieder-Schwalenberg hat einen modernen Spielplatz am Kurpark eröffnet.",
      bodyMD: "Der neue Spielplatz bietet zahlreiche Spielgeräte für Kinder jeden Alters und wurde nach neuesten Sicherheitsstandards errichtet.",
      category: "Stadtentwicklung",
      publishedAt: new Date("2025-10-15"),
      sourceUrl: "https://www.schieder-schwalenberg.de",
    },
    {
      id: nanoid(),
      title: "Stadtfest 2025 - Save the Date",
      teaser: "Das traditionelle Stadtfest findet am ersten Augustwochenende statt.",
      bodyMD: "Freuen Sie sich auf ein buntes Programm mit Live-Musik, kulinarischen Spezialitäten und Attraktionen für die ganze Familie.",
      category: "Veranstaltungen",
      publishedAt: new Date("2025-10-10"),
      sourceUrl: "https://www.schieder-schwalenberg.de",
    },
    {
      id: nanoid(),
      title: "Bauarbeiten in der Hauptstraße",
      teaser: "Ab nächster Woche beginnen die Sanierungsarbeiten in der Hauptstraße.",
      bodyMD: "Die Arbeiten werden voraussichtlich 6 Wochen dauern. Bitte beachten Sie die Umleitungen.",
      category: "Verkehr",
      publishedAt: new Date("2025-10-12"),
      sourceUrl: "https://www.schieder-schwalenberg.de",
    },
  ];

  for (const item of newsItems) {
    await db.insert(schema.news).values(item);
  }

  // Events
  const events = [
    {
      id: nanoid(),
      title: "Weihnachtsmarkt Schieder-Schwalenberg",
      description: "Traditioneller Weihnachtsmarkt mit regionalen Ständen und Kunsthandwerk",
      startDate: new Date("2025-12-06T16:00:00"),
      endDate: new Date("2025-12-06T21:00:00"),
      location: "Marktplatz",
      category: "Kultur",
      cost: "Eintritt frei",
    },
    {
      id: nanoid(),
      title: "Neujahrsempfang der Stadt",
      description: "Der Bürgermeister lädt zum traditionellen Neujahrsempfang ein",
      startDate: new Date("2026-01-10T18:00:00"),
      location: "Rathaus, Festsaal",
      category: "Politik",
      cost: "Auf Einladung",
    },
    {
      id: nanoid(),
      title: "Stadtführung durch die Altstadt",
      description: "Entdecken Sie die historische Altstadt von Schwalenberg",
      startDate: new Date("2025-10-25T14:00:00"),
      location: "Treffpunkt: Rathaus Schwalenberg",
      category: "Tourismus",
      cost: "5 Euro pro Person",
    },
  ];

  for (const event of events) {
    await db.insert(schema.events).values(event);
  }

  // Departments
  const departments = [
    {
      id: nanoid(),
      name: "Bürgerbüro",
      description: "Zentrale Anlaufstelle für alle Bürgeranliegen",
      responsibilities: "Personalausweise, Reisepässe, An- und Ummeldungen, Führungszeugnisse",
      contactName: "Frau Müller",
      phone: "05282 / 26-50",
      email: "buergerbuero@schieder-schwalenberg.de",
      address: "Rathausplatz 1, 32816 Schieder-Schwalenberg",
      openingHours: "Mo-Fr: 08:00-12:00 Uhr\nDo: 14:00-18:00 Uhr",
    },
    {
      id: nanoid(),
      name: "Ordnungsamt",
      description: "Zuständig für öffentliche Sicherheit und Ordnung",
      responsibilities: "Gewerbeangelegenheiten, Verkehrsüberwachung, Ordnungswidrigkeiten",
      contactName: "Herr Schmidt",
      phone: "05282 / 26-60",
      email: "ordnungsamt@schieder-schwalenberg.de",
      address: "Rathausplatz 1, 32816 Schieder-Schwalenberg",
      openingHours: "Mo-Fr: 08:00-12:00 Uhr",
    },
    {
      id: nanoid(),
      name: "Bauamt",
      description: "Baugenehmigungen und Stadtplanung",
      responsibilities: "Baugenehmigungen, Bebauungspläne, Bauberatung",
      contactName: "Herr Weber",
      phone: "05282 / 26-70",
      email: "bauamt@schieder-schwalenberg.de",
      address: "Rathausplatz 1, 32816 Schieder-Schwalenberg",
      openingHours: "Mo-Fr: 08:00-12:00 Uhr\nDo: 14:00-16:00 Uhr",
    },
  ];

  for (const dept of departments) {
    await db.insert(schema.departments).values(dept);
  }

  // POIs
  const pois = [
    {
      id: nanoid(),
      name: "Schieder See",
      description: "Beliebtes Naherholungsgebiet mit Badestrand und Wassersportmöglichkeiten",
      category: "Natur & Erholung",
      address: "Am Schieder See, 32816 Schieder-Schwalenberg",
      openingHours: "Ganzjährig zugänglich",
      pricing: "Eintritt frei",
    },
    {
      id: nanoid(),
      name: "Burg Schwalenberg",
      description: "Historische Burganlage mit Museum und herrlichem Ausblick",
      category: "Kultur & Geschichte",
      address: "Burgstraße, 32816 Schieder-Schwalenberg",
      openingHours: "April-Oktober: Di-So 10:00-17:00 Uhr",
      pricing: "Erwachsene 4 Euro, Kinder 2 Euro",
    },
    {
      id: nanoid(),
      name: "Kurpark Schieder",
      description: "Gepflegter Kurpark mit Spielplatz und Spazierwegen",
      category: "Natur & Erholung",
      address: "Kurparkstraße, 32816 Schieder-Schwalenberg",
      openingHours: "Ganzjährig zugänglich",
      pricing: "Eintritt frei",
    },
  ];

  for (const poi of pois) {
    await db.insert(schema.pois).values(poi);
  }

  // Institutions
  const institutions = [
    {
      id: nanoid(),
      name: "Kindergarten Sonnenschein",
      type: "Kindertagesstätte",
      description: "Städtischer Kindergarten mit 3 Gruppen",
      contactName: "Frau Becker",
      phone: "05282 / 12345",
      email: "kita-sonnenschein@schieder-schwalenberg.de",
      address: "Gartenstraße 10, 32816 Schieder-Schwalenberg",
    },
    {
      id: nanoid(),
      name: "Grundschule Schieder",
      type: "Grundschule",
      description: "Städtische Grundschule mit offenem Ganztag",
      contactName: "Herr Hoffmann",
      phone: "05282 / 23456",
      email: "grundschule@schieder-schwalenberg.de",
      address: "Schulstraße 5, 32816 Schieder-Schwalenberg",
    },
  ];

  for (const inst of institutions) {
    await db.insert(schema.institutions).values(inst);
  }

  // Council Meetings
  const meetings = [
    {
      id: nanoid(),
      title: "Ratssitzung November 2025",
      meetingDate: new Date("2025-11-15T18:00:00"),
      committee: "Stadtrat",
      location: "Rathaus, Sitzungssaal",
    },
    {
      id: nanoid(),
      title: "Ausschuss für Stadtentwicklung",
      meetingDate: new Date("2025-11-20T17:00:00"),
      committee: "Ausschuss Stadtentwicklung",
      location: "Rathaus, Raum 201",
    },
  ];

  for (const meeting of meetings) {
    await db.insert(schema.councilMeetings).values(meeting);
  }

  // Waste Schedule
  const wasteSchedule = [
    {
      id: nanoid(),
      wasteType: "Restmüll",
      collectionDate: new Date("2025-10-21"),
      district: "Schieder",
      street: "Hauptstraße",
    },
    {
      id: nanoid(),
      wasteType: "Biomüll",
      collectionDate: new Date("2025-10-23"),
      district: "Schieder",
      street: "Hauptstraße",
    },
    {
      id: nanoid(),
      wasteType: "Papier",
      collectionDate: new Date("2025-10-28"),
      district: "Schieder",
      street: "Hauptstraße",
    },
    {
      id: nanoid(),
      wasteType: "Gelber_Sack",
      collectionDate: new Date("2025-10-30"),
      district: "Schieder",
      street: "Hauptstraße",
    },
  ];

  for (const waste of wasteSchedule) {
    await db.insert(schema.wasteSchedule).values(waste);
  }

  // Alert
  await db.insert(schema.alerts).values({
    id: nanoid(),
    type: "Verkehr",
    title: "Straßensperrung Hauptstraße",
    message: "Aufgrund von Bauarbeiten ist die Hauptstraße vom 18.10. bis 30.11. gesperrt. Bitte nutzen Sie die ausgeschilderte Umleitung.",
    priority: "medium",
    validUntil: new Date("2025-11-30"),
    category: "Verkehr",
  });

  console.log("✅ Seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

