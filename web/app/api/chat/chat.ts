import { postJson } from "@/lib/api";

export interface ChatRequest {
    user_input: string;
    session_id: string;
    user_id: string;
}

export interface ChatResponse {
    response: string;
    session_id: string;
    user_id: string;
}


export async function getChatResponse(request: ChatRequest): Promise<ChatResponse> {
    return postJson<ChatResponse>("/v1/rest-retrieve", request);
}

