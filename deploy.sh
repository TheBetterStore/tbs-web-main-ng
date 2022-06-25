#!/bin/bash

# Ensure ENVIRONMENT AWS_PROFILE and BASE_URL variables are set for your environment appropriately
ENVIRONMENT=prod
APP_NAME=tbs-web-main
STACK_NAME=tbs-web-main-$ENVIRONMENT

aws cloudformation deploy --template-file template.yaml --stack-name $STACK_NAME \
--capabilities CAPABILITY_IAM --region us-east-1 --parameter-overrides \
Environment=$ENVIRONMENT \
WebDomainName=$BASE_URL \
--no-fail-on-empty-changeset \
--tags Environment=$ENVIRONMENT StackName=$STACK_NAME Product=$APP_NAME \
--profile $AWS_PROFILE


