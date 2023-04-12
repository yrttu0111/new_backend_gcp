import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai';
import { CreateCompletionDto } from './dto/create-completion.dto';
import axios from 'axios';


@Injectable()
export class ChatGPTService {
  private readonly openAIApi: OpenAIApi;

  constructor(
    // private readonly openAIApi: OpenAIApi,
  ) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.openAIApi = new OpenAIApi(configuration);
    
  }

  //옷을 추천해주는 ai 챗봇 
  async chatgpt({ createCompletionDto }) {
    const token = process.env.OPENAI_API_KEY;
    try {
    const {ask} = createCompletionDto
    const headers = {
    'Authorization': `Bearer ${token}`,
     "Content-Type": "application/json"
    };
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content":ask },
        {"role": "system", "content": `당신은 스타일을 추천해 주는 챗봇 챗또 입니다.
        당신은 세계에서 가장 유명한 스타일러이며 
        날씨에 맞는 옷을 추천해주거나 채형에 맞는 옷 과 옷 잘입는 방법등을 추천해줍니다`}]
      }
      
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: headers,
      data: data
    }
  
      
      );
    console.log(response.data.choices[0].message.content);
    const message= response.data.choices[0].message.content;
    const who = response.data.choices[0].message.role;
    const result = `${who} : ${message}`
    return result;
  } catch (e) {
    throw new Error(e);
  }
}
}