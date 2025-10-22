import { getDb } from "../server/db";
import { news } from "../drizzle/schema";

const announcements = [
  {
    id: "ann-1",
    title: "Hinweis auf das Widerspruchsrecht gegen die Datenübermittlung aus dem Melderegister",
    bodyMD: "Gemäß § 42 und § 50 des Bundesmeldegesetzes (BMG) vom 03. Mai 2013 (BGBl. I S. 1084) und gemäß § 58c des Soldatengesetzes (SG) vom 30.05.2005 (BGBI. I S. 1482) jeweils in der zzt. gültigen Fassung sind folgende Datenübermittlungen durch die Stadt Schieder-Schwalenberg als Meldebehörde zulässig.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-29"),

  },
  {
    id: "ann-2",
    title: "Bekanntmachung des Ergebnisses der Stichwahl des Bürgermeisters",
    bodyMD: "Nachdem der Wahlausschuss das Ergebnis der Stichwahl des Bürgermeisters festgestellt hat, wird dieses gem. § 35 und 46b des Kommunalwahlgesetzes (KWahlG) i.V.m. § 63 und 75a der Kommunalwahlordnung (KWahlO) hiermit bekanntgegeben.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-29"),

  },
  {
    id: "ann-3",
    title: "Briefwahl jetzt beantragen",
    bodyMD: "Am 28. September 2025 findet die Stichwahl zur Wahl des Landrates und des Bürgermeisters statt. Sie können Ihre Stimme auch per Briefwahl abgeben.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-18"),

  },
  {
    id: "ann-4",
    title: "Bekanntmachung des Ergebnisses der Ratswahl",
    bodyMD: "Nachdem der Wahlausschuss das Ergebnis der Ratswahl festgestellt hat, wird dieses gem. § 35 des Kommunalwahlgesetzes (KWahlG) i.V.m. § 63 der Kommunalwahlordnung (KWahlO) hiermit bekanntgegeben.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-17"),

  },
  {
    id: "ann-5",
    title: "Wahlbekanntmachung zur Stichwahl des Landrates und Bürgermeisters",
    bodyMD: "Am 28. September 2025 findet die Stichwahl zum Landrat des Kreises Lippe und zum Bürgermeister der Stadt Schieder-Schwalenberg statt.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-12"),

  },
  {
    id: "ann-6",
    title: "5. Satzung zur Änderung der Satzung des Abfallwirtschaftsverbandes Lippe",
    bodyMD: "Die 5. Satzung zur Änderung der Satzung des Abfallwirtschaftsverbandes Lippe vom 13.12.2019 ist nach Abschluss des Anzeigeverfahrens von der Aufsichtsbehörde genehmigt worden.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-09-12"),

  },
  {
    id: "ann-7",
    title: "Wahlbekanntmachung über die Kommunalwahlen am 14. September 2025",
    bodyMD: "Folgende Wahlen sind miteinander verbunden und finden am 14. September 2025 gleichzeitig statt: Wahl des Bürgermeisters der Stadt Schieder-Schwalenberg und Wahl der Vertretung der Stadt.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-08-27"),

  },
  {
    id: "ann-8",
    title: "Klimaschutzpreis 2025",
    bodyMD: "Ehrenamtliches Engagement ist eine der wichtigsten Säulen des Umweltschutzes. Deshalb möchten die Stadt Schieder-Schwalenberg und das Energieunternehmen Westenergie auch in diesem Jahr Projekte zum Schutz von Klima und Umwelt auszeichnen.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-08-26"),

  },
  {
    id: "ann-9",
    title: "Recht auf Einsicht in das Wählerverzeichnis und die Erteilung von Wahlscheinen",
    bodyMD: "Bekanntmachung der Stadt Schieder-Schwalenberg über das Recht auf Einsicht in das Wählerverzeichnis und die Erteilung von Wahlscheinen zu den Kommunalwahlen in Nordrhein-Westfalen am 14. September 2025.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-07-25"),

  },
  {
    id: "ann-10",
    title: "Hinweise für Unionsbürger zur Kommunalwahl",
    bodyMD: "Hinweise für die Kommunalwahlen in NRW am 14.09.2025 zum Antrag auf Eintragung in das Wählerverzeichnis und zu der Versicherung an Eides Statt für die von der Meldepflicht befreiten Unionsbürgerinnen und Unionsbürger.",
    category: "Bekanntmachung",
    publishedAt: new Date("2025-07-25"),

  }
];

const newsItems = [
  {
    id: "news-1",
    title: "Neuer Spielplatz am Kurpark eröffnet",
    bodyMD: "Die Stadt Schieder-Schwalenberg hat einen modernen Spielplatz am Kurpark eröffnet. Der neue Spielplatz bietet zahlreiche Spielgeräte für Kinder jeden Alters und lädt zum Verweilen ein.",
    category: "Stadtentwicklung",
    publishedAt: new Date("2025-10-15"),

  },
  {
    id: "news-2",
    title: "Bauarbeiten in der Hauptstraße",
    bodyMD: "Ab nächster Woche beginnen die Sanierungsarbeiten in der Hauptstraße. Die Arbeiten werden voraussichtlich vier Wochen dauern. Bitte beachten Sie die Umleitungen.",
    category: "Verkehr",
    publishedAt: new Date("2025-10-12"),

  },
  {
    id: "news-3",
    title: "Stadtfest 2025 - Save the Date",
    bodyMD: "Das traditionelle Stadtfest findet am ersten Augustwochenende statt. Freuen Sie sich auf ein buntes Programm mit Live-Musik, kulinarischen Köstlichkeiten und vielen Attraktionen für die ganze Familie.",
    category: "Veranstaltungen",
    publishedAt: new Date("2025-10-10"),

  },
  {
    id: "news-4",
    title: "Neue Öffnungszeiten der Stadtbücherei",
    bodyMD: "Ab November gelten neue Öffnungszeiten für die Stadtbücherei. Montag bis Freitag von 10 bis 18 Uhr, Samstag von 10 bis 14 Uhr.",
    category: "Kultur",
    publishedAt: new Date("2025-10-08"),

  },
  {
    id: "news-5",
    title: "Herbstferienprogramm für Kinder und Jugendliche",
    bodyMD: "In den Herbstferien bietet die Stadt Schieder-Schwalenberg wieder ein abwechslungsreiches Ferienprogramm für Kinder und Jugendliche an. Anmeldungen sind ab sofort möglich.",
    category: "Jugend",
    publishedAt: new Date("2025-10-05"),

  }
];

async function seedAnnouncements() {
  try {
    const database = await getDb();
    if (!database) {
      console.error("Database not available");
      return;
    }

    // Insert announcements
    for (const announcement of announcements) {
      await database.insert(news).values(announcement);
      console.log(`✓ Inserted announcement: ${announcement.title}`);
    }

    // Insert news
    for (const newsItem of newsItems) {
      await database.insert(news).values(newsItem);
      console.log(`✓ Inserted news: ${newsItem.title}`);
    }

    console.log("\n✅ Successfully seeded announcements and news!");
  } catch (error) {
    console.error("Error seeding announcements:", error);
  }
}

seedAnnouncements();

