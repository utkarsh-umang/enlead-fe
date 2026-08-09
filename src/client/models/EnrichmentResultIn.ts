/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EnrichmentResultIn = {
    lead_id: string;
    type?: string;
    cost_mode: EnrichmentResultIn.cost_mode;
    status: EnrichmentResultIn.status;
    value?: (string | null);
    confidence?: (number | null);
    provider?: (string | null);
    cost_incurred?: (number | null);
    evidence?: (Record<string, any> | null);
    person_first_name?: (string | null);
    person_last_name?: (string | null);
    person_job_title?: (string | null);
    person_seniority?: (string | null);
    email_status?: (string | null);
};
export namespace EnrichmentResultIn {
    export enum cost_mode {
        LOW = 'low',
        HIGH = 'high',
    }
    export enum status {
        FOUND = 'found',
        NOT_FOUND = 'not_found',
        FAILED = 'failed',
    }
}

