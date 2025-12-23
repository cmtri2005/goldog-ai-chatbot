import { postJson } from "@/lib/api";

export interface ChatRequest {
    user_input: string;
    session_id: string;
    user_id: string;
}

export interface ChatResponse {
    session_id: string;
    user_id: string;
    response: string;
    result?: any[];
}


export async function getChatResponse(request: ChatRequest): Promise<ChatResponse> {
    return postJson<ChatResponse>("/v1/rest-retrieve", request);
}

