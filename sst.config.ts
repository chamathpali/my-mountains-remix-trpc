/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input.stage === "production" ? "" : "CHANGE_PROFILE"
        }
      }
    };
  },
  async run() {

    // Setup DynamoDB Table
    const table = new sst.aws.Dynamo("MyMountainsDB", {
      fields: {
        uuid: "string",
        metadata: "string"
      },
      primaryIndex: { hashKey: "uuid", rangeKey: "metadata" }
    });

    // Setup trpc server
    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      handler: "server/index.handler",
      link: [table]
    });

    new sst.aws.Remix("MyMountains", { link: [trpc] });

    return {
      api: trpc.url,
      table: table.urn
    };
  },
});
