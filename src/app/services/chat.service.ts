import {Injectable} from '@angular/core';
import {BedrockRuntimeClient, ConverseCommand, Message} from '@aws-sdk/client-bedrock-runtime';
import {fetchAuthSession} from 'aws-amplify/auth';
import {environment} from '../../environments/environment';
import {catchError} from "rxjs/operators";
import {firstValueFrom} from 'rxjs';
import {BaseService} from "./base.service";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ChatService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  private messages: Message[] = [];

  async sendMessage(userMessage: string): Promise<string> {

    this.messages.push({role: 'user', content: [{text: userMessage}]});

    // const command = new ConverseCommand({
    //   modelId: environment.bedrockModelId,
    //   messages: this.messages,
    //   system: [{text: 'You are a helpful shopping assistant for The Better Store, an electronics and books retailer. Keep responses brief.'}],
    // });
    //
    // const response = await client.send(command);


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

  clearHistory(): void {
    this.messages = [];
  }
}
