import { pollQueue } from "./order.worker";

// START POLLING WHEN THE WORKER STARTS
pollQueue().catch(error => {
    console.error("Error starting SQS Polling:", error);
});
