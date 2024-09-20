import { z } from "zod";
import {
    awsLambdaRequestHandler,
    CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { initTRPC } from "@trpc/server";
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import { MountainSchema } from "./schemas";

const t = initTRPC
    .context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
    .create();

const publicProcedure = t.procedure;

const dummyData = [{ name: "Mount Everest", distance: 8848, location: "Nepal/China", climbedAt: "2028-01-23", level: 10 }];

const router = t.router({
    health: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return `Health Endpoint is working for ${input.name}!`;
        }),
    list: publicProcedure
        .output(z.array(MountainSchema))
        .query(() => {
            return dummyData;
        }),
    add: publicProcedure
        .input(MountainSchema)
        .query(({ input }) => {
            dummyData.push(input);
            return input;
        }),
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
    router: router,
    createContext: (opts) => opts,
});
