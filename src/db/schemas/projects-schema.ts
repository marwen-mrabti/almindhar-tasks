import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod";
import { organizations, users } from "./auth-schema";
import { tasks } from "./tasks-schema";

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
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
    index("projects_organizationId_idx").on(table.organizationId),
    index("projects_createdBy_idx").on(table.createdBy),
  ],
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),

  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),

  tasks: many(tasks),
}));

export const projectSchema = createSelectSchema(projects);

export const projectInsertSchema = createInsertSchema(projects, {
  name: z
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

export const projectUpdateSchema = createUpdateSchema(projects).omit({ id: true, createdAt: true, updatedAt: true, createdBy: true, organizationId: true });

export type Project = z.infer<typeof projectSchema>;
export type ProjectInsertInput = z.infer<typeof projectInsertSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
