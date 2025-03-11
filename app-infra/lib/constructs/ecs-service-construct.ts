import {
  FargateService,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { ISecurityGroup, IVpc, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { SharedResources } from '../types/shared-resources';
import { ApplicationListener, ApplicationProtocol, ApplicationTargetGroup, IApplicationLoadBalancer, ListenerAction, ListenerCertificate, ListenerCondition, TargetType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Duration } from 'aws-cdk-lib';
import { Protocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { EcsService } from '../types/service';
export interface EcsServiceConstructProps {
  service: EcsService;
  task: TaskDefinition;
  sharedResources: SharedResources
}

export class EcsServiceConstruct extends Construct {

  addToLoadBalancer = (scope: Construct, service: EcsService, vpc: IVpc, fargateService: FargateService, loadBalancer: IApplicationLoadBalancer, securityGroup: SecurityGroup, lbSecurityGroup: ISecurityGroup) => {

    lbSecurityGroup.addIngressRule(
      securityGroup,
      Port.tcp(80),
      "HealthCheck Inbound",
      true
    )

    const healthCheck = {
      path: '/',
      timeout: Duration.seconds(30),
      interval: Duration.seconds(60),
      protocol: Protocol.HTTP,
      healthyHttpCodes: '200-399',
      port: '80',
    };

    let applicationListener = new ApplicationListener(
      scope,
      'Port443Listener',
      {
        port: 443,
        protocol: ApplicationProtocol.HTTPS,
        loadBalancer: loadBalancer,
        certificates: [
          ListenerCertificate.fromArn(process.env.CERT_ARN!)
        ],
        open: true
      },
    );


    let localBlueTargetGroup = new ApplicationTargetGroup(
      scope,
      `BTG-${service.serviceName}`,
      {
        vpc: vpc,
        port: 80,
        protocol: ApplicationProtocol.HTTP,
        targetGroupName: `${service.serviceName}-blue-tg`,
        targetType: TargetType.IP,
        healthCheck: healthCheck
      }
    );

    let conditions: ListenerCondition[] = [];
    conditions.push(ListenerCondition.pathPatterns(["/"]));
    applicationListener.addTargetGroups(
      `LTG-${service.serviceName}`,
      {
        priority: 1,
        targetGroups: [localBlueTargetGroup],
        conditions: conditions,
      }

    );
    localBlueTargetGroup.addTarget(fargateService);

    applicationListener.addAction('defaultaction', {
      action: ListenerAction.forward([localBlueTargetGroup])
    });
  }

  constructor(scope: Construct, id: string, props: EcsServiceConstructProps) {
    super(scope, id);

    const securityGroup = new SecurityGroup(
      scope,
      `SG-${props.service.serviceName}`,
      {
        vpc: props.sharedResources.vpc,
        securityGroupName: `ecs-service-${props.service.serviceName}-sg`,
        description: `ECS Service ${props.service.serviceName} Security Group`,
        allowAllOutbound: true,
      }
    );

    const service = new FargateService(
      scope,
      `Service-${props.service.serviceName}`,
      {
        cluster: props.sharedResources.cluster,
        taskDefinition: props.task,
        desiredCount: 1,
        serviceName: props.service.serviceName,
        securityGroups: [securityGroup],
      }
    );
    this.addToLoadBalancer(scope, props.service, props.sharedResources.vpc, service, props.sharedResources.loadBalancer, securityGroup, props.sharedResources.securityGroup);

  }
}
