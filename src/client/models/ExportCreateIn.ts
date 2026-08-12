/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExportCreateIn = {
    lead_ids?: (Array<string> | null);
    search?: (string | null);
    source?: (string | null);
    has_email?: (boolean | null);
    email_from_finder?: (boolean | null);
    lead_tag?: (string | null);
    classified_industry?: (string | null);
    classified_industries?: (Array<string> | null);
    icp_accepted?: (boolean | null);
    year: number;
    month: number;
    include_already_exported?: boolean;
};

