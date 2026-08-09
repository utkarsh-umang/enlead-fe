/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkerPauseIn } from '../models/WorkerPauseIn';
import type { WorkerPauseState } from '../models/WorkerPauseState';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * Get Worker Pause State
     * @returns WorkerPauseState Successful Response
     * @throws ApiError
     */
    public static getWorkerPauseState(): CancelablePromise<WorkerPauseState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/system/workers/pause-state',
        });
    }
    /**
     * Pause Workers
     * Idle both workers. The finder's held long-poll re-checks and re-blocks;
     * the classifier stops claiming lists and halts its current one mid-batch.
     * @param requestBody
     * @returns WorkerPauseState Successful Response
     * @throws ApiError
     */
    public static pauseWorkers(
        requestBody?: (WorkerPauseIn | null),
    ): CancelablePromise<WorkerPauseState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/system/workers/pause',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resume Workers
     * Clear the gate — both workers pick work back up (finder instantly, the
     * classifier within its ~15s poll).
     * @returns WorkerPauseState Successful Response
     * @throws ApiError
     */
    public static resumeWorkers(): CancelablePromise<WorkerPauseState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/system/workers/resume',
        });
    }
}
