CREATE TABLE `pushNotifications` (
	`id` varchar(64) NOT NULL,
	`title` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','warning','danger','event') NOT NULL DEFAULT 'info',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`isActive` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`createdBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `pushNotifications_id` PRIMARY KEY(`id`)
);
