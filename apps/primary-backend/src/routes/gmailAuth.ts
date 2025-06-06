import { Router } from 'express';
import { oauth2client } from '../utils/googleClient';
import db from "@repo/db/client"
import { authMiddleware } from '../middleware';
import { google } from 'googleapis';

const router = Router();

router.get("/", (req, res) => {
    const url = oauth2client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.labels',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    });
    res.redirect(url);
})

router.get("/callback", async (req, res) => {
    const code = req.query.code as string;

    try {
        // const userId = Number(req.id);
        const userId = 3;

        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);

        const oauth2 = google.oauth2({ auth: oauth2client, version: 'v2' });
        const { data: profile } = await oauth2.userinfo.get();
        const userEmail = profile.email;

        const existingAccount = await db.connectedAccount.findFirst({
            where: {
                userId,
                provider: 'GMAIL'
            },
        });

        const accountData = {
            accessToken: tokens.access_token as string,
            refreshToken: tokens.refresh_token ?? existingAccount?.refreshToken ?? '',
            expiresAt: new Date(tokens.expiry_date!),
            scope: tokens.scope,
            email: userEmail!
        }

        if (existingAccount) {
            await db.connectedAccount.update({
                where: {
                    id: existingAccount.id
                },
                data: accountData
            });

            return res.status(200).json({
                message: 'Gmail account reconnected and updated successfully'
            })
        }

        await db.connectedAccount.create({
            data: {
                userId,
                type: 'OAUTH',
                provider: 'GMAIL',
                ...accountData
            }
        })

        res.status(200).json({
            message: 'Gmail account connected successfully'
        })
    } catch (error) {
        console.log('Error during authentication', error)
        res.status(500).send('Error during authentication');
    }
});

router.post("/refreshToken", authMiddleware, async (req, res) => {
    const userId = Number(req.id);
    let connectedAccount;

    try {
        connectedAccount = await db.connectedAccount.findFirst({
            where: {
                userId,
                provider: 'GMAIL'
            }
        });

        if (!connectedAccount) {
            return res.status(404).json({
                message: 'No connected Gmail account found'
            })
        }

        oauth2client.setCredentials({
            refresh_token: connectedAccount.refreshToken,
        });

        const { credentials } = await oauth2client.refreshAccessToken();

        if (!credentials.access_token || !credentials.expiry_date) {
            return res.status(500).json({
                message: 'Failed to refresh access token'
            });
        }

        await db.connectedAccount.update({
            where: {
                id: connectedAccount.id
            },
            data: {
                accessToken: credentials.access_token,
                expiresAt: new Date(credentials.expiry_date),
            },
        });

        res.status(200).json({
            message: 'Access token refreshed successfully',
        });
    } catch (err: any) {
        console.error('Error refreshing access token:', err);

        if (
            err?.response?.status === 400 ||
            err?.response?.data?.error === 'invalid_grant'
        ) {
            await db.connectedAccount.update({
                where: {
                    id: connectedAccount?.id,
                },
                data: {
                    refreshToken: ""
                },
            });

            return res.status(401).json({
                message: 'Refresh token is invalid or expired. Please reconnect your Gmail account.'
            })
        }

        res.status(500).json({
            message: 'Unexpected error while refreshing token',
            error: err.message
        });
    }
});

export const gmailAuthRouter = router;