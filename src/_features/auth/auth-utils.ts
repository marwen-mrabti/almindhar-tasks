import { z } from 'zod';

export const magicLinkLoginSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(3, 'username must be at least 3 characters'),
});
export type MagicLinkCredentials = z.infer<typeof magicLinkLoginSchema>;
export const MAGIC_LINK_DATA_KEY = 'magic-link-data';
