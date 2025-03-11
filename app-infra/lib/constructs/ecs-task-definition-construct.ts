import {
  AppProtocol,
  Compatibility,
  ContainerImage,
  CpuArchitecture,
  LogDrivers,
  NetworkMode,
  OperatingSystemFamily,
  Protocol,
  Secret,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IStringParameter, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { EcsService } from '../types/service';

export interface EcsTaskDefinitionConstructProps {
  service: EcsService;
}

export class EcsTaskDefinitionConstruct extends Construct {
  private readonly _taskDefinition: TaskDefinition;

  public get task(): TaskDefinition {
    return this._taskDefinition;
  }

  /**
   *
   */
  constructor(
    scope: Construct,
    id: string,
    props: EcsTaskDefinitionConstructProps
  ) {
    super(scope, id);

    // uncomment this if you want to use DD tracing
    const parameter = StringParameter.fromStringParameterName(scope, "DDApiKey", "/core-infra/dd-api-key");

    this._taskDefinition = new TaskDefinition(scope, `${props.service.serviceName}-TaskDefinition`, {
      cpu: '1024',
      memoryMiB: '2048',
      compatibility: Compatibility.FARGATE,
      runtimePlatform: {
        cpuArchitecture: CpuArchitecture.ARM64,
        operatingSystemFamily: OperatingSystemFamily.LINUX,
      },
      networkMode: NetworkMode.AWS_VPC,
      family: `${props.service.serviceName}-task`,
    });

    this._taskDefinition.addToExecutionRolePolicy(
      new PolicyStatement({
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: ['*'],
        effect: Effect.ALLOW,
      }));

    // uncomment this if you want to use DD tracing
    this._taskDefinition.addToTaskRolePolicy(
      new PolicyStatement({
        actions: ["ssm:Get*"],
        effect: Effect.ALLOW,
        resources: [parameter.parameterArn]
      }));

    this.addApiContainer(props.service);

  }

  /// addApiContainer creates the service api and attaches to the taskdefinition
  addApiContainer = (service: EcsService) => {
    // api container
    const apiContainer = this._taskDefinition.addContainer('rust-api', {
      // Use an image from Amazon ECR
      image: ContainerImage.fromRegistry(
        `${service.ecrUri}:${service.imageTag}`
      ),
      logging: LogDrivers.awsLogs({ streamPrefix: service.serviceName }),
      environment: {
      },
      containerName: service.apiShortName,
      essential: true,
      cpu: 1024,
      memoryReservationMiB: 2048,
    });

    apiContainer.addPortMappings({
      containerPort: 80,
      appProtocol: AppProtocol.http,
      name: 'web',
      protocol: Protocol.TCP,
    });

  }

}
