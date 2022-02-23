import { Bucket as BucketAWS } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class Bucket extends Construct {
  public readonly pipelineBucket: BucketAWS;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.pipelineBucket = new BucketAWS(scope, 'PipelineBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
    });
  }
}
