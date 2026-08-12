/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportCreateIn } from '../models/ExportCreateIn';
import type { ExportLeadsPage } from '../models/ExportLeadsPage';
import type { ExportOut } from '../models/ExportOut';
import type { ExportPreviewOut } from '../models/ExportPreviewOut';
import type { ExportSelection } from '../models/ExportSelection';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExportsService {
    /**
     * List Exports
     * Every export event, newest first — the contact system of record.
     * @returns ExportOut Successful Response
     * @throws ApiError
     */
    public static listExports(): CancelablePromise<Array<ExportOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exports',
        });
    }
    /**
     * Create Export
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createExport(
        requestBody: ExportCreateIn,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/exports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Export
     * Remove an export event created in error / never actually sent. Drops its
     * membership rows too, so its leads stop counting as already-contacted and
     * become exportable again. Does not touch the leads themselves.
     * @param exportId
     * @returns void
     * @throws ApiError
     */
    public static deleteExport(
        exportId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/exports/{export_id}',
            path: {
                'export_id': exportId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Export Leads
     * The member leads of one export event. Paginated — a
     * select-all-matching export can hold thousands. Leads deleted since the
     * export simply drop out of this view (the event's lead_count keeps the
     * historical number).
     * @param exportId
     * @param page
     * @param pageSize
     * @returns ExportLeadsPage Successful Response
     * @throws ApiError
     */
    public static getExportLeads(
        exportId: string,
        page: number = 1,
        pageSize: number = 25,
    ): CancelablePromise<ExportLeadsPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/exports/{export_id}/leads',
            path: {
                'export_id': exportId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Export
     * @param requestBody
     * @returns ExportPreviewOut Successful Response
     * @throws ApiError
     */
    public static previewExport(
        requestBody: ExportSelection,
    ): CancelablePromise<ExportPreviewOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/exports/preview',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
