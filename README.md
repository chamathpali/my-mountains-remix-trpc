# ⛰️ My Mountains ⛰️
An example app using SST, Remix and tRPC to create a modern and typesafe project.

### Features
A simple web app to keep track of the mountains you have climbed 🥾!

- [ ] List all Mountains - GET
- [ ] Create Mountain - POST
- [ ] Inner Mountain page - GET


### Tech Stack
- [SST](https://sst.dev/) as Infrastructure as Code for AWS
- [Remix](https://remix.run/) React framework
- [tRPC](https://trpc.io/) for Typesafe APIs
- [shadcn/ui](https://ui.shadcn.com/) for UI

### Infrastructure on AWS
- API: AWS Lambda
- DB: DynamoDB


## Setup Guide

Clone and install dependencies
```
yarn
```
#### Setup AWS
Follow the guide [here ](https://sst.dev/docs/aws-accounts) or use your existing AWS profile.

Make sure to update the AWS profile name in `sst.config.ts`
```js
providers: {
        aws: {
          profile: input.stage === "production" ? "" : "CHANGE_THIS" <----
        }
}
```

#### Start Dev mode
`npx sst dev`

#### Deployment
`npx sst deploy`

For more information read the [SST docs](https://sst.dev/docs/)



