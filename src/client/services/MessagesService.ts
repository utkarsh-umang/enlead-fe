/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GenerateMessagesIn } from '../models/GenerateMessagesIn';
import type { GenerateMessagesResult } from '../models/GenerateMessagesResult';
import type { MessagePreviewOut } from '../models/MessagePreviewOut';
import type { MethodOut } from '../models/MethodOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessagesService {
    /**
     * List Message Methods
     * Every registered generation method, for the UI's method picker.
     * @returns MethodOut Successful Response
     * @throws ApiError
     */
    public static listMessageMethods(): CancelablePromise<Array<MethodOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/messages/methods',
        });
    }
    /**
     * Preview Messages
     * Dry run: a few real outputs (and, for deterministic methods, the exact
     * count the method can write). Writes nothing. For llm methods the preview is
     * sample-based — running the whole list just to count would spend real calls.
     * @param requestBody
     * @returns MessagePreviewOut Successful Response
     * @throws ApiError
     */
    public static previewMessages(
        requestBody: GenerateMessagesIn,
    ): CancelablePromise<MessagePreviewOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/messages/preview',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Messages
     * Write `email_to_send` for every lead in the list the method can produce a
     * line for. Latest run wins (overwrite); leads the method skips are left as-is.
     * `limit` bounds the run — important for the slow, rate-limited llm methods.
     * @param requestBody
     * @returns GenerateMessagesResult Successful Response
     * @throws ApiError
     */
    public static generateMessages(
        requestBody: GenerateMessagesIn,
    ): CancelablePromise<GenerateMessagesResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/messages/generate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
