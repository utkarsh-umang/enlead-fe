/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A list the worker should classify (requested + has pending leads).
 */
export type RequestedBatch = {
    batch_id: string;
    source: string;
    filename: string;
    pending: number;
};

