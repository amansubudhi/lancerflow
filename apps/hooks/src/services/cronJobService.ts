import cron from "node-cron"
import { checkGmailLabelTriggers } from "./checkGmailLabelTrigger";
import { fetchTogglTimeEntriesTrigger } from "./fetchTogglTimeEntriesTrigger";

//Run cron every 5 mins - change the time below
cron.schedule('* * * * *', async () => {
    try {
        console.log('Checking for new email with specific label...');
        await checkGmailLabelTriggers();
    } catch (error) {
        console.error('Error in email trigger cron job:', error);
    }
});

// Run everyday at 7 pm - IST
cron.schedule('', async () => {
    try {
        console.log('Fetching Toggl Report....');
        await fetchTogglTimeEntriesTrigger();
    } catch (error) {
        console.error('Error in fetching Toggl Report cron job:', error);
    }
})