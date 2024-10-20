# ⛰️ My Mountains ⛰️
An example app using SST, Remix and tRPC to create a modern and typesafe project.

### Features
A simple web app to keep track of the mountains you have climbed 🥾!

- [X] List all Mountains - GET
- [X] Create Mountain - POST
- [X] Delete Mountain - DELETE
- [X] Integrate OpenAI API for text summary (Optional)


### Tech Stack
- [SST](https://sst.dev/) as Infrastructure as Code for AWS
- [Remix](https://remix.run/) React framework
- [tRPC](https://trpc.io/) for Typesafe APIs
- [shadcn/ui](https://ui.shadcn.com/) for UI

### Infrastructure on AWS
- API: AWS Lambda
- DB: DynamoDB
- CloudFront Distribution
- Assets: S3 Bucket
- Remix SSR: AWS Lambda

## Screenshots
#### List
<img width="1341" alt="Screenshot 2024-10-20 at 22 40 21" src="https://github.com/user-attachments/assets/bf558741-31fb-4143-82fe-29a4564bbd39">

#### Create
<img width="1341" alt="Screenshot 2024-10-20 at 22 40 39" src="https://github.com/user-attachments/assets/26fc2883-6fa6-46e6-86d5-104343854ef9">

#### AI Summary
<img width="1341" alt="Screenshot 2024-10-20 at 22 40 50" src="https://github.com/user-attachments/assets/73d94875-09a0-4eab-ad66-bddb400d6317">

#### Dark Mode Supported
<img width="1341" alt="Screenshot 2024-10-20 at 22 41 03" src="https://github.com/user-attachments/assets/69ea631d-03ed-4d0a-a63d-97c437351dea">

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

#### Setup OpenAI Key (Optional)
Only set this if you want to see how the summaries are generated for mountains added
```
npx sst secret set OPENAI_API_KEY CHANGE_THIS
```


#### Start Dev mode
`npx sst dev`

#### Deployment
`npx sst deploy`

For more information read the [SST docs](https://sst.dev/docs/)



