CREATE TABLE `answer_suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` text NOT NULL,
	`suggested_answer` text NOT NULL,
	`player_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date_key` text NOT NULL,
	`scroll_id` text NOT NULL,
	`player_id` text NOT NULL,
	`nickname` text NOT NULL,
	`score` integer NOT NULL,
	`correct_count` integer NOT NULL,
	`elapsed_ms` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_scores_date_player_unique` ON `daily_scores` (`date_key`,`player_id`);--> statement-breakpoint
CREATE TABLE `scroll_approvals` (
	`scroll_id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
