import { z } from "zod";

export const ResponseSchema = z.object({
    status: z.boolean(),
    message: z.string().optional(),
    data: z.object({}).optional()
})

export const MountainSchema = z.object({
    uuid: z.string().optional(),
    metadata: z.string().optional(),
    views: z.number().optional(),
    name: z.string(),
    distance: z.number(),
    location: z.string(),
    climbedAt: z.string(),
    createdAt: z.string().optional(),
    genAISummary: z.string().nullable().optional(), // Only if using the OpenAI API
    level: z.number(),
})
