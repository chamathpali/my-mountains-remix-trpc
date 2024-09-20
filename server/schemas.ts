import { z } from "zod";

export const MountainSchema = z.object({
    uuid: z.string().optional(),
    name: z.string(),
    distance: z.number(),
    location: z.string(),
    climbedAt: z.string(),
    level: z.number(),
})
