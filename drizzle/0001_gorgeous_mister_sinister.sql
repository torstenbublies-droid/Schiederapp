CREATE TABLE `alerts` (
	`id` varchar(64) NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`validUntil` timestamp,
	`category` varchar(100),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatLogs` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`sessionId` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`response` text NOT NULL,
	`intent` varchar(200),
	`isLocal` boolean DEFAULT true,
	`sourceDocs` text,
	`tokens` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `chatLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `councilMeetings` (
	`id` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`meetingDate` timestamp NOT NULL,
	`committee` varchar(200),
	`agendaUrl` varchar(1000),
	`minutesUrl` varchar(1000),
	`location` varchar(500),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `councilMeetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` varchar(64) NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`responsibilities` text,
	`contactName` varchar(200),
	`phone` varchar(50),
	`email` varchar(320),
	`address` text,
	`openingHours` text,
	`appointmentLink` varchar(1000),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`location` varchar(500),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`imageUrl` varchar(1000),
	`ticketLink` varchar(1000),
	`category` varchar(100),
	`cost` varchar(200),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` varchar(64) NOT NULL,
	`name` varchar(500) NOT NULL,
	`type` varchar(100) NOT NULL,
	`description` text,
	`contactName` varchar(200),
	`phone` varchar(50),
	`email` varchar(320),
	`address` text,
	`websiteUrl` varchar(1000),
	`registrationInfo` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `institutions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `issueReports` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`category` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`address` varchar(500),
	`photoUrl` varchar(1000),
	`status` enum('eingegangen','in_bearbeitung','erledigt') NOT NULL DEFAULT 'eingegangen',
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`ticketNumber` varchar(50) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `issueReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mayorInfo` (
	`id` varchar(64) NOT NULL,
	`name` varchar(200) NOT NULL,
	`party` varchar(100),
	`position` varchar(200),
	`photoUrl` varchar(1000),
	`email` varchar(320),
	`phone` varchar(50),
	`bio` text,
	`calendarUrl` varchar(1000),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `mayorInfo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`teaser` text,
	`bodyMD` text,
	`imageUrl` varchar(1000),
	`category` varchar(100),
	`publishedAt` timestamp NOT NULL,
	`sourceUrl` varchar(1000),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pois` (
	`id` varchar(64) NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`category` varchar(100),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`address` varchar(500),
	`imageUrl` varchar(1000),
	`websiteUrl` varchar(1000),
	`openingHours` text,
	`pricing` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `pois_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`favoriteCategories` text,
	`wasteDistrict` varchar(200),
	`wasteStreet` varchar(500),
	`notificationSettings` text,
	`savedPois` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wasteSchedule` (
	`id` varchar(64) NOT NULL,
	`wasteType` varchar(100) NOT NULL,
	`collectionDate` timestamp NOT NULL,
	`district` varchar(200),
	`street` varchar(500),
	`route` varchar(100),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `wasteSchedule_id` PRIMARY KEY(`id`)
);
