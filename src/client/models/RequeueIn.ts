/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Re-queue leads for another enrichment attempt WITHOUT deleting the ledger:
 * their current attempts at this cost_mode are marked superseded (rows stay),
 * and their finder-earned email is cleared so the queue serves them again.
 * Use this instead of deleting attempt rows.
 */
export type RequeueIn = {
    lead_ids: Array<string>;
    cost_mode?: RequeueIn.cost_mode;
};
export namespace RequeueIn {
    export enum cost_mode {
        LOW = 'low',
        HIGH = 'high',
    }
}

