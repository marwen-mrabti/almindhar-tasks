import { z } from 'zod';

export function validateWithPretty<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    // Prettify the error
    const error = z.prettifyError(result.error);

    throw new Error(error);
  }

  return result.data;
}
