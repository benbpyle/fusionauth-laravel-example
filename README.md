# Come for the Simplicity, Stay for the Extensibility. Identity with FusionAuth 

## Description

This repository is a working example of how to incorporate user Identity with [FusionAuth](https://fusionauth.io/) into a 
PHP [Laravel](https://laravel.com/) that is deployed on [AWS](https://aws.amazon.com/).

There is also an accompanying article published on Laravel News that can be found [here]()

### Organization of the Project

This repository is divided into 3 parts delineated by the directories that each piece sits in.

```bash
    - app-infra # the Laravel application's AWS CDK infrastructure code
    - fusionauth-app # the PHP Laravel application
    - infra # base level infrastructure in AWS CDK. Cluster setup, network and VPC definitions
```