import { z } from "zod";
import {
    awsLambdaRequestHandler,
    CreateAWSLambdaContextOptions,
} from "@trpc/server/adapters/aws-lambda";
import { initTRPC } from "@trpc/server";
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";
import { MountainSchema, ResponseSchema } from "./schemas";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { v4 as uuidv4 } from 'uuid';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const t = initTRPC
    .context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
    .create();

const publicProcedure = t.procedure;

const router = t.router({
    health: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
            return `Health Endpoint is working for ${input.name}!`;
        }),
    list: publicProcedure
        .output(z.array(MountainSchema))
        .query(async () => {
            try {
                // Not the optimal way, but for testing :) 
                const mountains = await dynamo.send(
                    new ScanCommand({
                        TableName: Resource.MyMountainsDB.name,
                        FilterExpression: "begins_with(metadata, :prefix)",
                        ExpressionAttributeValues: {
                            ":prefix": "CLIMBED",
                        },
                    })
                );

                if (mountains.Items) {
                    const parsedItems = MountainSchema.array().safeParse(mountains.Items);

                    if (parsedItems.success) {
                        return parsedItems.data.sort((a, b) => new Date(b.climbedAt).getTime() - new Date(a.climbedAt).getTime());
                    } else {
                        console.log("Validation failed:", parsedItems.error);
                    }
                }
            } catch (e) {
                console.log(e);
            }

            return []
        }),
    add: publicProcedure
        .input(MountainSchema)
        .output(ResponseSchema)
        .query(async ({ input }) => {
            try {

                // TODO: Optional GenAI summary for the mountain
                let generatedSummary = null;
                if(Resource.OPENAI_API_KEY.value != 'OPTIONAL'){
                    generatedSummary =  'TODO';
                }
                //

                const create = await dynamo.send(
                    new PutCommand({
                        TableName: Resource.MyMountainsDB.name,
                        Item: {
                            uuid: 'MOUNTAIN#' + uuidv4(),
                            metadata: 'CLIMBED#' + input.climbedAt,
                            name: input.name,
                            distance: input.distance,
                            climbedAt: input.climbedAt,
                            level: input.level,
                            location: input.location,
                            genAISummary: generatedSummary,
                            views: 0,
                            createdAt: new Date().toISOString()
                        },
                    })
                );

                if (create.$metadata.httpStatusCode === 200) {
                    return { "message": "Mountain Added Successfully!", status: true }
                }
            } catch (e) {
                console.log(e);
            }

            return { "message": "Failed to add Mountain!", status: false };
        }),
    delete: publicProcedure
        .input(z.object({
            uuid: z.string(),
            metadata: z.string()
        }))
        .output(ResponseSchema)
        .mutation(async ({ input }) => {
            try {
                const deleted = await dynamo.send(
                    new DeleteCommand({
                        TableName: Resource.MyMountainsDB.name,
                        Key: {
                            uuid: input.uuid,
                            metadata: input.metadata,
                        },
                    })
                );

                if (deleted.$metadata.httpStatusCode === 200) {
                    return { "message": "Mountain Deleted Successfully!", status: true }
                }
            } catch (e) {
                console.log(e);
            }

            return { "message": "Failed to delete Mountain!", status: false };
        }),
});

export type Router = typeof router;

export const handler = awsLambdaRequestHandler({
    router: router,
    createContext: (opts) => opts,
});
