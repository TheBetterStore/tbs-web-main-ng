export interface IError {
  ErrorId: string;
  MessageId: string;
  TopicArn: string;
  Subject?: string;
  Message: string;
  Timestamp: string;
  RequestId: string;
  ErrorCode: string;
  ErrorMessage: string;
  CustomCode: string;
  Status: string;
}
