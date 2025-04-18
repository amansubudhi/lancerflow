import { google } from "googleapis";

type GmailTokenData = {
    accessToken: string;
    refreshToken: string;
    expiryDate: Date;
    clientId: string;
    clientSecret: string;
}

export const createOAuthClient = (tokenData: GmailTokenData) => {
    const oAuth2Client = new google.auth.OAuth2(
        tokenData.clientId,
        tokenData.clientSecret
    );

    oAuth2Client.setCredentials({
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
        expiry_date: new Date(tokenData.expiryDate).getTime(),
    });

    return oAuth2Client;
};

export const refressAccessTokenIfNeeded = async (oAuth2Client: any) => {
    const tokenInfo = await oAuth2Client.getAccessToken();

    if (!tokenInfo.token) throw new Error("Unable to refresh access token");

    return tokenInfo.token;
};

export const getLabelIdByName = async (gmail: any, labelName: string): Promise<string | null> => {
    const res = await gmail.users.labels.list({ userId: "me" });
    const labels = res.data.labels || [];

    const label = labels.find((l: any) => l.name === labelName);
    return label ? label.id : null;
}

export const listMessagesWithLabel = async (gmail: any, labelId: string): Promise<string[]> => {
    const res = await gmail.users.messages.list({
        userId: "me",
        labelIds: [labelId],
        maxResults: 10, // Tune this based on need
    });

    const messages = res.data.messages || [];
    return messages.map((m: any) => m.id);
};

export const getMessageDetails = async (gmail: any, messageId: string) => {
    const res = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
    });

    return res.data;
}

