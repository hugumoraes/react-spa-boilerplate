import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Bucket } from './constructs/Bucket';
import { Pipeline } from './constructs/Pipeline';

export class InfrastructureStack extends Stack {
  public readonly buckets: Bucket;

  public readonly pipeline: Pipeline;

  public readonly project_name: string;

  public readonly repo: string;

  public readonly owner: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.project_name = 'react-spa-boilerplate';
    this.owner = 'hugumoraes';
    this.repo = 'react-spa-boilerplate';

    this.buckets = new Bucket(this, 'Buckets');

    this.pipeline = new Pipeline(this, 'Pipelines', {
      bucket: this.buckets.pipelineBucket,
      project_name: this.project_name,
      owner: this.owner,
      repo: this.repo,
    });
  }
}
