// Fulfillment abstraction layer - PRD Section 1C
// Start with ManualFulfillment, swap to Lob/PostGrid via config change

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface DesignFiles {
  frontUrl: string;
  backUrl: string;
  format: "pdf" | "png";
}

export interface Campaign {
  id: string;
  name: string;
  mailPieceType: "postcard_4x6" | "postcard_6x9" | "letter_8.5x11" | "brochure";
  quantity: number;
}

export type JobStatus =
  | "pending"
  | "processing"
  | "printing"
  | "mailed"
  | "delivered"
  | "cancelled"
  | "error";

export interface FulfillmentJob {
  id: string;
  campaignId: string;
  provider: string;
  status: JobStatus;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface TrackingInfo {
  status: JobStatus;
  mailDate?: Date;
  estimatedDeliveryDate?: Date;
  deliveredCount?: number;
  returnedCount?: number;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: Date;
  status: string;
  description: string;
}

export interface FulfillmentProvider {
  createMailJob(
    campaign: Campaign,
    mailingList: Address[],
    designFiles: DesignFiles
  ): Promise<FulfillmentJob>;

  getJobStatus(jobId: string): Promise<JobStatus>;

  cancelJob(jobId: string): Promise<void>;

  getTrackingInfo(jobId: string): Promise<TrackingInfo>;
}
