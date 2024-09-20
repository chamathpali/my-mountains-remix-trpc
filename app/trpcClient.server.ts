import { Resource } from "sst";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { Router } from "server";

const client = createTRPCClient<Router>({
    links: [
        httpBatchLink({
            url: Resource.Trpc.url,
        }),
    ],
});

export default client;