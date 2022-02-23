import { SecretValue } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { config } from 'dotenv';
import {
  Pipeline as PipelineAWS,
  Artifact,
} from 'aws-cdk-lib/aws-codepipeline';
import {
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';
import {
  CodeBuildAction,
  GitHubSourceAction,
  GitHubTrigger,
} from 'aws-cdk-lib/aws-codepipeline-actions';

config();

interface Props {
  bucket: Bucket;
  project_name: string;
  owner: string;
  repo: string;
}

export class Pipeline extends Construct {
  public readonly secret: SecretValue;

  public readonly cloudfrontdistribution: Distribution;

  public readonly origin: S3Origin;

  public readonly outputSources: Artifact;

  public readonly outputWebsite: Artifact;

  public readonly pipeline: PipelineAWS;

  public readonly project: PipelineProject;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.secret = new SecretValue(process.env.GITHUB);
    this.origin = new S3Origin(props.bucket);

    this.cloudfrontdistribution = new Distribution(
      scope,
      'CloudFrontDistribution',
      {
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: this.origin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    );

    this.outputSources = new Artifact();
    this.outputWebsite = new Artifact();

    this.pipeline = new PipelineAWS(scope, 'Pipeline', {
      pipelineName: `react-spa-boilerplate-pipeline-${props.project_name}`,
      restartExecutionOnUpdate: true,
    });

    this.project = new PipelineProject(scope, 'PipelineProject', {
      projectName: props.project_name,
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
        computeType: ComputeType.SMALL,
      },
      buildSpec: BuildSpec.fromSourceFilename('./web/buildspec.yml'),
      environmentVariables: {
        CLOUDFRONT_ID: {
          value: this.cloudfrontdistribution.distributionId,
        },
        BUCKET_NAME: {
          value: props.bucket.bucketName,
        },
      },
    });

    this.project.addToRolePolicy(
      new PolicyStatement({
        actions: ['cloudfront:*'],
        resources: [
          `arn:aws:cloudfront::${process.env.CDK_DEFAULT_ACCOUNT}:distribution/${this.cloudfrontdistribution.distributionId}`,
        ],
      }),
    );

    props.bucket.grantReadWrite(this.project);

    this.pipeline.addStage({
      stageName: 'Source',
      actions: [
        new GitHubSourceAction({
          actionName: 'Source',
          owner: props.owner,
          repo: props.repo,
          branch: 'main',
          oauthToken: this.secret,
          output: this.outputSources,
          trigger: GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    this.pipeline.addStage({
      stageName: 'Build',
      actions: [
        new CodeBuildAction({
          actionName: 'Build',
          project: this.project,
          input: this.outputSources,
          outputs: [this.outputWebsite],
        }),
      ],
    });
  }
}
