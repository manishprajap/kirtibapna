CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`blurb` varchar(255) NOT NULL DEFAULT '',
	`parent_id` varchar(36),
	`active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`order_number` varchar(32) NOT NULL,
	`customer` json NOT NULL,
	`items` json NOT NULL,
	`subtotal` int NOT NULL,
	`shipping` int NOT NULL,
	`total` int NOT NULL,
	`payment_method` enum('razorpay','cod') NOT NULL,
	`payment_status` enum('pending','paid','failed','partially_refunded','refunded') NOT NULL DEFAULT 'pending',
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`razorpay_order_id` varchar(80),
	`razorpay_payment_id` varchar(80),
	`invoice_number` varchar(40) NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_number_unique` UNIQUE(`order_number`),
	CONSTRAINT `orders_invoice_unique` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`price` int NOT NULL,
	`mrp` int NOT NULL,
	`fabric` varchar(160),
	`description` text NOT NULL,
	`colors` json NOT NULL,
	`sizes` json NOT NULL,
	`palette` json NOT NULL,
	`tag` enum('New','Bestseller','Sale'),
	`featured` boolean NOT NULL DEFAULT false,
	`sold_out` boolean NOT NULL DEFAULT false,
	`care` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`images` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`transaction_id` varchar(36) NOT NULL,
	`provider_refund_id` varchar(100),
	`amount` int NOT NULL,
	`reason` varchar(500) NOT NULL,
	`status` enum('pending','processed','failed') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refunds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`provider` enum('razorpay','cod','manual') NOT NULL,
	`type` enum('payment','refund') NOT NULL,
	`provider_transaction_id` varchar(100),
	`amount` int NOT NULL,
	`status` enum('created','authorized','captured','failed','processed','pending') NOT NULL,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_id_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refunds` ADD CONSTRAINT `refunds_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `categories_parent_index` ON `categories` (`parent_id`);--> statement-breakpoint
CREATE INDEX `orders_status_index` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_created_index` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `products_category_index` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `products_featured_index` ON `products` (`featured`);--> statement-breakpoint
CREATE INDEX `refunds_order_index` ON `refunds` (`order_id`);--> statement-breakpoint
CREATE INDEX `refunds_provider_id_index` ON `refunds` (`provider_refund_id`);--> statement-breakpoint
CREATE INDEX `transactions_order_index` ON `transactions` (`order_id`);--> statement-breakpoint
CREATE INDEX `transactions_provider_id_index` ON `transactions` (`provider_transaction_id`);