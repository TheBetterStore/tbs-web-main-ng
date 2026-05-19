import {Injectable} from '@angular/core';
import {BedrockRuntimeClient, ConverseCommand, Message} from '@aws-sdk/client-bedrock-runtime';
import {fetchAuthSession} from 'aws-amplify/auth';
import {environment} from '../../environments/environment';
import {catchError} from "rxjs/operators";
import {firstValueFrom} from 'rxjs';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from '@aws-sdk/client-bedrock-agentcore';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

@Injectable({providedIn: 'root'})
export class ChatService extends BaseService {
  private readonly AGENT_RUNTIME_ARN = environment.agentcoreRuntimeArn;
  private sessionId: string;

  constructor(private http: HttpClient) {
    super();
    this.sessionId = crypto.randomUUID();
  }

  private messages: Message[] = [];

  private async getAgentCoreClient(): Promise<BedrockAgentCoreClient> {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString() || '';
    const cognitoProviderUrl = `cognito-idp.ap-southeast-2.amazonaws.com/${environment.awsmobile.aws_user_pools_id}`;
    return new BedrockAgentCoreClient({
      region: 'ap-southeast-2',
      credentials: fromCognitoIdentityPool({
        identityPoolId: environment.awsmobile.aws_cognito_identity_pool_id,
        logins: {
          [cognitoProviderUrl]: idToken,
        },
        clientConfig: { region: 'ap-southeast-2' },
      }),
    });
  }

  async sendMessage(userMessage: string): Promise<string> {

    this.messages.push({role: 'user', content: [{text: userMessage}]});

    const url = `${environment.apiBaseUrl}/chat/v1/query`;
    console.log('Calling url:' + url);
    const res = await firstValueFrom(
      this.http.post<any>(url, this.messages)
        .pipe(catchError(this.handleError))
    );

    console.log('res:', JSON.stringify(res));
    const assistantText = res?.output?.message?.content?.[0]?.text ?? 'Sorry, I could not generate a response.';
    this.messages.push({role: 'assistant', content: [{text: assistantText}]});
    return assistantText;
  }

  async sendMessageAgentCore(userMessage: string): Promise<string> {
    this.messages.push({role: 'user', content: [{text: userMessage}]});

    const client = await this.getAgentCoreClient();
    const payload = JSON.stringify({ prompt: userMessage, messages: this.messages });

    const command = new InvokeAgentRuntimeCommand({
      agentRuntimeArn: this.AGENT_RUNTIME_ARN,
      runtimeSessionId: this.sessionId,
      payload: new TextEncoder().encode(payload),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await client.send(command);

    let assistantText = 'Sorry, I could not generate a response.';
    if (response.response) {
      const chunks: string[] = [];
      const reader = response.response as any;
      if (typeof reader[Symbol.asyncIterator] === 'function') {
        for await (const chunk of reader) {
          chunks.push(new TextDecoder().decode(chunk));
        }
      } else if (reader instanceof Uint8Array || reader instanceof ArrayBuffer) {
        chunks.push(new TextDecoder().decode(reader));
      }
      const body = chunks.join('');
      if (body) {
        const textParts: string[] = [];
        for (const line of body.split('data: ')) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.text) textParts.push(parsed.text);
          } catch { /* skip non-JSON lines */ }
        }
        assistantText = textParts.length > 0 ? textParts.join('') : body;
      }
    }

    this.messages.push({role: 'assistant', content: [{text: assistantText}]});
    return assistantText;
  }

  clearHistory(): void {
    this.messages = [];
    this.sessionId = crypto.randomUUID();
  }
}
