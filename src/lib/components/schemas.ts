import { z } from 'zod/v4';

export const q_schema = z.object({
    id: z.number(),
    titlu: z.string(),
    raspuns: z.string(),
    selectat: z.boolean(),
    echipa: z.string(),
});

export const schema = z.object({
    id: z.number(),
    header: z.string(),
    type: z.string(),
    status: z.string(),
    target: z.string(),
    limit: z.string(),
    reviewer: z.string(),
});

export type Schema = z.infer<typeof schema>;
export type QSchema = z.infer<typeof q_schema>;
