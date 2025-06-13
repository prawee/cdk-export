#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkExportStack } from '../lib/cdk-export-stack';

const app = new cdk.App();
new CdkExportStack(app, 'CdkExportStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT ?? undefined,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-southeast-1' 
  },
});