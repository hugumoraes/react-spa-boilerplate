#!/usr/bin/env node
/* eslint-disable no-new */
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { InfrastructureStack } from "../src/infrastructure-stack";

const app = new cdk.App();

new InfrastructureStack(app, "InfrastructureStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
