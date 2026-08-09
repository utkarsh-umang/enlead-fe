/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassificationResultsIn } from '../models/ClassificationResultsIn';
import type { ClassificationResultsOut } from '../models/ClassificationResultsOut';
import type { ClassificationStatus } from '../models/ClassificationStatus';
import type { PendingLead } from '../models/PendingLead';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClassificationService {
    /**
     * Classification Pending
     * Leads in this list with a website but no classification yet (oldest first).
     * @param batchId
     * @param limit
     * @returns PendingLead Successful Response
     * @throws ApiError
     */
    public static classificationPending(
        batchId: string,
        limit: number = 100,
    ): CancelablePromise<Array<PendingLead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classification/pending',
            query: {
                'batch_id': batchId,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Classification Results
     * Upsert classification verdicts onto the leads. Latest write wins.
     * @param requestBody
     * @returns ClassificationResultsOut Successful Response
     * @throws ApiError
     */
    public static classificationResults(
        requestBody: ClassificationResultsIn,
    ): CancelablePromise<ClassificationResultsOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classification/results',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Classification Status
     * Progress + the industry breakdown for a list.
     * @param batchId
     * @returns ClassificationStatus Successful Response
     * @throws ApiError
     */
    public static classificationStatus(
        batchId: string,
    ): CancelablePromise<ClassificationStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classification/status',
            query: {
                'batch_id': batchId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
