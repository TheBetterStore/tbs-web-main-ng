export const environment = {
  production: true,
  stripePublicKey: '{STRIPE_PUBLIC_KEY}',
  apiBaseUrl: 'https://{API_BASE_URL}/v1',
  agentcoreRuntimeArn: '{AGENT_RUNTIME_ARN}',
  baseUrl: '{BASE_URL}',
  envLabel: '{ENV_LABEL}',
  bedrockRegion: 'us-east-1',
  bedrockModelId: 'anthropic.claude-3-haiku-20240307-v1:0',
  awsmobile: {
    aws_cognito_identity_pool_id: '{IDENTITY_POOL_ID}',
    aws_cognito_region: '{AWS_REGION}',
    aws_user_pools_id: '{USERPOOL_ID}',
    aws_user_pools_web_client_id: '{USERPOOL_WEBCLIENTID}'
  }
};
