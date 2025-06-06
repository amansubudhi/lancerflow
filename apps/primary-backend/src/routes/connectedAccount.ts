import { Router } from 'express';
import db from "@repo/db/client"
import { authMiddleware } from '../middleware';

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);

        const connectedAccount = await db.connectedAccount.findMany({
            where: {
                userId,
            }
        });

        res.status(200).json({
            connectedAccount
        })
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving connected accounts',
            error: error.message,
        })
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = Number(req.id);
        const accoundId = req.params.id;

        const account = await db.connectedAccount.findUnique({
            where: {
                id: Number(accoundId),
            }
        });

        if (!account || account.userId !== userId) {
            return res.status(403).json({
                message: 'Unauthorized to delete this account',
            });
        }

        await db.connectedAccount.delete({
            where: {
                id: Number(accoundId),
            }
        })

        res.status(200).json({
            message: 'Connected account deleted successfully',
        })
    } catch (error: any) {
        res.status(500).json({
            message: 'Error deleting connected account',
            error: error.message
        })
    }
});

export const connectedAccountRouter = router;