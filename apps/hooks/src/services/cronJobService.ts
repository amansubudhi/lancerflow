import cron from "node-cron"
import { checkGmailLabelTriggers } from "./checkGmailLabelTrigger";

cron.schedule('* * * * *', async () => {
    try {
        console.log('Checking for new email with specific label...');
        await checkGmailLabelTriggers();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});