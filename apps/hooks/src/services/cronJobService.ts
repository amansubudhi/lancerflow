import cron from "node-cron"
import { fetchTogglTimeEntriesTrigger } from "./fetchTogglTimeEntriesTrigger";
import { sendReadyInvoices } from "./sendReadyInvoices";
import { sendTestimonialForm } from "./sendTestimonialForm";

//Run cron every 5 mins - change the time below
cron.schedule('* * * * *', async () => {
    try {
        console.log('Checking clients with invoices paid to send testimonial...');
        await sendTestimonialForm();
        // await sendReadyInvoices();
    } catch (error) {
        console.error('Error in testimonail cron job:', error);
    }
});

// Run everyday at 7 pm - IST for Toggl
// cron.schedule('* * * * *', async () => {
//     try {
//         console.log('Fetching Toggl Report....');
//         await fetchTogglTimeEntriesTrigger();
//     } catch (error) {
//         console.error('Error in fetching Toggl Report cron job:', error);
//     }
// })


// cron.schedule('', async () => {
//     try {
//         console.log("Checking invoices with finalised status and the deadline is over");
//         await sendReadyInvoices();
//         await sendTestimonialForm();
//     } catch (error) {
//         console.error(error)
//     }
// })