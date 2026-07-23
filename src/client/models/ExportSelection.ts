/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Mirrors how selection works in the frontend: either an explicit list
 * of lead ids, or "everything matching the current filter" (the
 * select-all-matching flag) expressed as the filter params themselves.
 */
export type ExportSelection = {
    lead_ids?: (Array<string> | null);
    search?: (string | null);
    source?: (string | null);
    has_email?: (boolean | null);
    email_from_finder?: (boolean | null);
    lead_tag?: (string | null);
};

