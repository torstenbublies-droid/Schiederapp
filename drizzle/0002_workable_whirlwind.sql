CREATE TABLE `contactMessages` (
	`id` varchar(64) NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320),
	`subject` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`status` enum('neu','in_bearbeitung','erledigt') NOT NULL DEFAULT 'neu',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
