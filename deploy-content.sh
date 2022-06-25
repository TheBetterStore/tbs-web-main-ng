#!/bin/bash

# Ensure the following variables are set:
# ENVIRONMENT
# AWS_ACCOUNT_ID
# AWS_PROFILE
# API_BASE_URL
# BASE_URL e.g. thebetterstore.net
# ENV_LABEL e.g. prod
# AWS_REGION e.g. ap-southeast-2
# USERPOOL_ID e.g. ap-southeast-2_1122334455
# USERPOOL_WEBCLIENTID e.g. 423523423543454325

# are set for your environment appropriately

cp ./src/environments/environment.ts.config ./src/environments/environment.prod.ts
sed -i 's/{API_BASE_URL}/$API_BASE_URL/' ./src/environments/environment.prod.ts
sed -i 's/{BASE_URL}/$BASE_URL/' ./src/environments/environment.prod.ts
sed -i 's/{ENV_LABEL}/prod/' ./src/environments/environment.prod.ts
sed -i 's/{AWS_REGION}/ap-southeast-2/' ./src/environments/environment.prod.ts
sed -i 's/{USERPOOL_ID}/$USERPOOL_ID/' ./src/environments/environment.prod.ts
sed -i 's/{USERPOOL_WEBCLIENTID}/$USERPOOL_WEBCLIENTID/' ./src/environments/environment.prod.ts

npm run build

aws s3 sync ./dist/tbs-web-main-ng s3://web-us-east-1-$AWS_ACCOUNT_ID-tbs-$ENVIRONMENT --profile $AWS_PROFILE
aws cloudfront list-distributions --output json --query "DistributionList.Items[?Comment=='$BASE_URL'].Id" | awk -F '"' '{print $2}' | xargs -I{} aws cloudfront create-invalidation --distribution-id {} --paths "/*"

