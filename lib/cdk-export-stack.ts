import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import 'dotenv/config'

export class CdkExportStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, 'CdkExportLambda', {
      entry: path.join(__dirname, '../src/lambda.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(60),
      bundling: {
        nodeModules: ['hono', 'exceljs', 'dotenv', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
      },
      environment: {
        S3_REGION: process.env.S3_REGION || 'ap-southeast-1',
        S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '', 
        S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',
      },
    });

    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, 'CdkExportLambdaFunctionUrl', {
      value: fnUrl.url,
    });
  }
}
