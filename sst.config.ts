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
    // Setup trpc server
    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      handler: "server/index.handler",
    });

    new sst.aws.Remix("MyMountains", { link: [trpc] });

    return {
      api: trpc.url,
    };
  },
});
