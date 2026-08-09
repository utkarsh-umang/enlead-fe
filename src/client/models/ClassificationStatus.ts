/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClassificationStatus = {
    batch_id: string;
    classify_requested: boolean;
    total_leads: number;
    with_website: number;
    classified: number;
    pending: number;
    icp_accepted: number;
    by_industry: Record<string, number>;
    paused?: boolean;
};

