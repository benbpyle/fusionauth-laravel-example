import { AmiHardwareType, AsgCapacityProvider, Cluster, EcsOptimizedImage } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { IVpc, InstanceType, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { NamespaceType } from 'aws-cdk-lib/aws-servicediscovery';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';

export interface EcsClusterConstructProps {
  vpc: IVpc;
}

export class EcsClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EcsClusterConstructProps) {
    super(scope, id);

    const securityGroup = new SecurityGroup(
      scope,
      `EcsSecurityGroup`,
      {
        vpc: props.vpc,
        allowAllOutbound: true,
      }
    );

    let cluster = new Cluster(
      scope,
      `EcsCluster`,
      {
        clusterName: `DemoCluster`,
        vpc: props.vpc,
        defaultCloudMapNamespace: {
          name: "highlands.local",
          useForServiceConnect: true,
          type: NamespaceType.HTTP,
          vpc: props.vpc
        }
      }
    );


    new StringParameter(scope, `SsmParamClusterName`, {
      parameterName: `/core-infra/demo-cluster-name`,
      stringValue: 'DemoCluster',
    });

    new StringParameter(scope, `SsmParamClusterArn`, {
      parameterName: `/core-infra/demo-cluster-arn`,
      stringValue: cluster.clusterArn,
    });
  }
}
