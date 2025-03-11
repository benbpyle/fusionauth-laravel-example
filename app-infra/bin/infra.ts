#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SampleAppStack } from '../lib/sample-app-stack';

const app = new cdk.App();
new SampleAppStack(app, 'SampleAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  service: {
    serviceName: 'SampleApp',
    ecrUri: 'public.ecr.aws/f8u4w2p3/fusion-auth-laravel-sample-app',
    imageTag: 'latest',
    apiShortName: 'sample-app'
  },
});
