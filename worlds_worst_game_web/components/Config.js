const CognitoConfig = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-1:8a928322-9602-40dd-9781-6cf943ff6337',
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_aEiPyv7w5',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: '7jta8j40gbvmm6ekn15v273360',
  }
};


export default CognitoConfig
