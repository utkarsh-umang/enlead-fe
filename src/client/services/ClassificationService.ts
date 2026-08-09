/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassificationResultsIn } from '../models/ClassificationResultsIn';
import type { ClassificationResultsOut } from '../models/ClassificationResultsOut';
import type { ClassificationStatus } from '../models/ClassificationStatus';
import type { PendingLead } from '../models/PendingLead';
import type { RequestClassificationIn } from '../models/RequestClassificationIn';
import type { RequestClassificationOut } from '../models/RequestClassificationOut';
import type { RequestedBatch } from '../models/RequestedBatch';
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
    /**
     * Request Classification
     * Mark a list for classification — the worker will pick it up.
     * @param requestBody
     * @returns RequestClassificationOut Successful Response
     * @throws ApiError
     */
    public static requestClassification(
        requestBody: RequestClassificationIn,
    ): CancelablePromise<RequestClassificationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classification/request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stop Classification
     * Clear the classify request — the worker stops picking up this list.
     * @param requestBody
     * @returns RequestClassificationOut Successful Response
     * @throws ApiError
     */
    public static stopClassification(
        requestBody: RequestClassificationIn,
    ): CancelablePromise<RequestClassificationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classification/stop',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Requested Classifications
     * Lists the worker should classify: requested AND still have pending leads.
     * @returns RequestedBatch Successful Response
     * @throws ApiError
     */
    public static requestedClassifications(): CancelablePromise<Array<RequestedBatch>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classification/requested',
        });
    }
}
