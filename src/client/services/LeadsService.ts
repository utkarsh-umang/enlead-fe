/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichmentAttemptOut } from '../models/EnrichmentAttemptOut';
import type { LeadPage } from '../models/LeadPage';
import type { LeadRawRowOut } from '../models/LeadRawRowOut';
import type { LeadStats } from '../models/LeadStats';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeadsService {
    /**
     * Get Lead Stats
     * @returns LeadStats Successful Response
     * @throws ApiError
     */
    public static getLeadStats(): CancelablePromise<LeadStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads/stats',
        });
    }
    /**
     * List Leads
     * @param page
     * @param pageSize
     * @param search
     * @param source
     * @param hasEmail
     * @param finderTried
     * @param emailFromFinder
     * @param leadTag
     * @returns LeadPage Successful Response
     * @throws ApiError
     */
    public static listLeads(
        page: number = 1,
        pageSize: number = 25,
        search?: (string | null),
        source?: (string | null),
        hasEmail?: (boolean | null),
        finderTried?: (boolean | null),
        emailFromFinder?: (boolean | null),
        leadTag?: (string | null),
    ): CancelablePromise<LeadPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads',
            query: {
                'page': page,
                'page_size': pageSize,
                'search': search,
                'source': source,
                'has_email': hasEmail,
                'finder_tried': finderTried,
                'email_from_finder': emailFromFinder,
                'lead_tag': leadTag,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Lead Raw Rows
     * Every original CSV row that ever contributed to this lead, via the
     * lead_sources provenance trail — the untouched pre-mapping values.
     * @param leadId
     * @returns LeadRawRowOut Successful Response
     * @throws ApiError
     */
    public static getLeadRawRows(
        leadId: string,
    ): CancelablePromise<Array<LeadRawRowOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads/{lead_id}/raw',
            path: {
                'lead_id': leadId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Lead Enrichment Attempts
     * @param leadId
     * @returns EnrichmentAttemptOut Successful Response
     * @throws ApiError
     */
    public static getLeadEnrichmentAttempts(
        leadId: string,
    ): CancelablePromise<Array<EnrichmentAttemptOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads/{lead_id}/enrichment',
            path: {
                'lead_id': leadId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Lead
     * @param leadId
     * @returns void
     * @throws ApiError
     */
    public static deleteLead(
        leadId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/leads/{lead_id}',
            path: {
                'lead_id': leadId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
