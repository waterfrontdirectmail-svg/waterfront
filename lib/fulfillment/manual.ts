// ManualFulfillment - Phase 1 implementation
// CSV + file export, manual status updates by admin
// Replace with LobFulfillment or PostGridFulfillment when ready

import type {
  FulfillmentProvider,
  Campaign,
  Address,
  DesignFiles,
  FulfillmentJob,
  JobStatus,
  TrackingInfo,
} from "./types";

export class ManualFulfillment implements FulfillmentProvider {
  /**
   * Creates a "manual" mail job.
   * In practice this generates a downloadable CSV of the mailing list
   * and bundles the design files for admin to send to the print vendor.
   * Status is updated manually by admin via the fulfillment dashboard.
   */
  async createMailJob(
    campaign: Campaign,
    mailingList: Address[],
    designFiles: DesignFiles
  ): Promise<FulfillmentJob> {
    // TODO: Store job record in DB, generate CSV export of mailingList,
    // store designFiles references, notify admin via Slack/email
    const jobId = `manual-${campaign.id}-${Date.now()}`;

    console.log(
      `[ManualFulfillment] Created job ${jobId} for campaign ${campaign.name}`,
      `| ${mailingList.length} addresses | Design: ${designFiles.frontUrl}`
    );

    return {
      id: jobId,
      campaignId: campaign.id,
      provider: "manual",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        addressCount: mailingList.length,
        designFrontUrl: designFiles.frontUrl,
        designBackUrl: designFiles.backUrl,
      },
    };
  }

  /**
   * Returns the current status. For manual fulfillment, this reads
   * from the DB where admin has set the status.
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    // TODO: Query DB for job status
    console.log(`[ManualFulfillment] Getting status for ${jobId}`);
    return "pending";
  }

  /**
   * Cancel a job. For manual fulfillment, marks as cancelled in DB
   * and notifies admin to halt production if in progress.
   */
  async cancelJob(jobId: string): Promise<void> {
    // TODO: Update DB status to cancelled, notify admin
    console.log(`[ManualFulfillment] Cancelling job ${jobId}`);
  }

  /**
   * Returns tracking info. For manual fulfillment, admin enters
   * mail date and delivery estimates manually.
   */
  async getTrackingInfo(jobId: string): Promise<TrackingInfo> {
    // TODO: Query DB for tracking info entered by admin
    console.log(`[ManualFulfillment] Getting tracking for ${jobId}`);
    return {
      status: "pending",
      events: [],
    };
  }
}
