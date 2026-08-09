/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichmentQueueItem } from '../models/EnrichmentQueueItem';
import type { EnrichmentResultIn } from '../models/EnrichmentResultIn';
import type { EnrichmentStatusOut } from '../models/EnrichmentStatusOut';
import type { HeartbeatIn } from '../models/HeartbeatIn';
import type { PauseIn } from '../models/PauseIn';
import type { RequeueIn } from '../models/RequeueIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EnrichmentService {
    /**
     * Get Enrichment Queue
     * Leads needing an email attempt at this cost tier: no email yet, and
     * never attempted at this cost_mode. A low-cost miss therefore stays in
     * the high-cost queue — that's the deliberate escalation path.
     * @param costMode
     * @param limit
     * @returns EnrichmentQueueItem Successful Response
     * @throws ApiError
     */
    public static getEnrichmentQueue(
        costMode: string = 'low',
        limit: number = 25,
    ): CancelablePromise<Array<EnrichmentQueueItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/enrichment/queue',
            query: {
                'cost_mode': costMode,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Wait Enrichment Queue
     * Long-poll variant of /queue: holds the request open until work
     * exists (returns immediately with it) or `timeout` elapses (returns []).
     * While paused (human-in-the-loop gate), it blocks even if work exists —
     * a Resume wakes it instantly.
     *
     * Deliberately no DbSession dependency: that would pin a pooled
     * connection for the whole held request. Short-lived sessions are opened
     * only for each actual check.
     * @param costMode
     * @param limit
     * @param timeout
     * @returns EnrichmentQueueItem Successful Response
     * @throws ApiError
     */
    public static waitEnrichmentQueue(
        costMode: string = 'low',
        limit: number = 50,
        timeout: number = 55,
    ): CancelablePromise<Array<EnrichmentQueueItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/enrichment/queue/wait',
            query: {
                'cost_mode': costMode,
                'limit': limit,
                'timeout': timeout,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Post Worker Heartbeat
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static postWorkerHeartbeat(
        requestBody: HeartbeatIn,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/enrichment/heartbeat',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pause Enrichment
     * Called by the worker on a hard block (credits exhausted, bad key).
     * Only POST /resume — a human action — reopens the gate.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static pauseEnrichment(
        requestBody: PauseIn,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/enrichment/pause',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resume Enrichment
     * The 'Continue — I've recharged' button. Clears the gate and wakes
     * any worker blocked on /queue/wait immediately.
     * @returns void
     * @throws ApiError
     */
    public static resumeEnrichment(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/enrichment/resume',
        });
    }
    /**
     * Requeue Leads
     * Re-queue leads for another attempt WITHOUT deleting the ledger. Marks
     * their current attempts at cost_mode superseded (rows stay — the append-only
     * ledger and all spend history are preserved) and clears their finder-earned
     * email so the queue serves them again. Use this instead of deleting rows.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static requeueLeads(
        requestBody: RequeueIn,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/enrichment/requeue',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Enrichment Status
     * @returns EnrichmentStatusOut Successful Response
     * @throws ApiError
     */
    public static getEnrichmentStatus(): CancelablePromise<EnrichmentStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/enrichment/status',
        });
    }
    /**
     * Post Enrichment Result
     * Record one attempt and, on a find, fill the lead's email — in the
     * same transaction, so the ledger and the lead can't disagree.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static postEnrichmentResult(
        requestBody: EnrichmentResultIn,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/enrichment/results',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
