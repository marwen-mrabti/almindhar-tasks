import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod";
import { organizations, users } from "./auth-schema";
import { projects } from "./projects-schema";

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    isDone: boolean("is_done").default(false).notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("tasks_organizationId_idx").on(table.organizationId),
    index("tasks_projectId_idx").on(table.projectId),
    index("tasks_createdBy_idx").on(table.createdBy),
  ],
);

export const tasksRelations = relations(tasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),

  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),

  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
}));

export const taskSchema = createSelectSchema(tasks);

export const taskInsertSchema = createInsertSchema(tasks, {
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must be less than 10,000 characters')
    .trim(),
}).omit({ id: true, createdAt: true, updatedAt: true, createdBy: true });

export const taskUpdateSchema = createUpdateSchema(tasks).omit({ id: true, createdAt: true, updatedAt: true, createdBy: true });

export type Task = z.infer<typeof taskSchema>;
export type TaskInsertInput = z.infer<typeof taskInsertSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
