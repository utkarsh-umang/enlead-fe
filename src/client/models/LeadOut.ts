/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SourceFileOut } from './SourceFileOut';
export type LeadOut = {
    id: string;
    email: (string | null);
    email_source: (string | null);
    email_confidence: (number | null);
    website: (string | null);
    social_youtube: (string | null);
    social_twitter: (string | null);
    social_instagram: (string | null);
    social_tiktok: (string | null);
    social_facebook: (string | null);
    social_linkedin: (string | null);
    country: (string | null);
    niche: (string | null);
    category: (string | null);
    industry: (string | null);
    first_name: (string | null);
    last_name: (string | null);
    job_title: (string | null);
    seniority: (string | null);
    phone: (string | null);
    company_name: (string | null);
    company_linkedin: (string | null);
    lead_tag: (string | null);
    youtube_channel_name: (string | null);
    youtube_channel_id: (string | null);
    youtube_handle: (string | null);
    youtube_subscriber_count: (number | null);
    youtube_video_count: (number | null);
    youtube_uploads_last_30d: (number | null);
    youtube_avg_views: (number | null);
    youtube_last_upload_date: (string | null);
    created_at: string;
    sources: Array<string>;
    source_files: Array<SourceFileOut>;
    last_contacted: (string | null);
    email_finder_tried: boolean;
};

