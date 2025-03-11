import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcsServiceConstruct } from './constructs/ecs-service-construct';
import { EcsTaskDefinitionConstruct } from './constructs/ecs-task-definition-construct';
import { SharedResourcesConstruct } from './constructs/shared-resources-construct';
import { EcsService } from './types/service';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface SampleAppStackProps extends cdk.StackProps {
  service: EcsService;
}

export class SampleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SampleAppStackProps) {
    super(scope, id, props);

    const sharedResourcesConstruct = new SharedResourcesConstruct(this, 'SharedResourcesConstruct');
    const taskDefinitionConstruct = new EcsTaskDefinitionConstruct(
      this,
      'TaskDefinitionConstruct',
      {
        service: props.service,
      }
    );

    new EcsServiceConstruct(
      this,
      'EcsServiceConstruct',
      {
        task: taskDefinitionConstruct.task,
        service: props?.service,
        sharedResources: sharedResourcesConstruct.sharedResources
      }
    );
  }
}
