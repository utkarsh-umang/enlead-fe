/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HoldResult } from '../models/HoldResult';
import type { ReleaseResult } from '../models/ReleaseResult';
import type { SourceDetail } from '../models/SourceDetail';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SourcesService {
    /**
     * Release Enrichment Hold
     * Lift the import-time hold for this source's leads — they join the
     * email finder queue immediately (the worker is woken, not polled).
     * @param source
     * @param limit Release only a bounded tranche of this many leads (a budgeted run). Picks the oldest never-attempted held leads first, so the released count equals what the worker will actually process. Omit to release the whole source.
     * @returns ReleaseResult Successful Response
     * @throws ApiError
     */
    public static releaseEnrichmentHold(
        source: string,
        limit?: (number | null),
    ): CancelablePromise<ReleaseResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sources/{source}/release-enrichment',
            path: {
                'source': source,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Hold Enrichment
     * Re-hold this source's not-yet-found leads — pull them out of the finder
     * queue so no more credits are spent, leaving them parked for a later
     * Release. The counterpart to release-enrichment; only leads still without an
     * email are affected (found ones are done).
     * @param source
     * @returns HoldResult Successful Response
     * @throws ApiError
     */
    public static holdEnrichment(
        source: string,
    ): CancelablePromise<HoldResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sources/{source}/hold-enrichment',
            path: {
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Source Detail
     * @param source
     * @returns SourceDetail Successful Response
     * @throws ApiError
     */
    public static getSourceDetail(
        source: string,
    ): CancelablePromise<SourceDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/sources/{source}',
            path: {
                'source': source,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
