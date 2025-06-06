import { Router } from "express";
import { authMiddleware } from "../middleware";
import { FlowCreateSchema, FlowUpdateSchema } from "../types";
import db from "@repo/db/client"
import generateUniqueName from "../utils/generateUniqueName";

const router = Router();


router.post("/", authMiddleware, async (req, res) => {

    const userId = Number(req.id);
    const body = req.body;
    const parsedData = FlowCreateSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    };

    try {
        const finalName = parsedData.data.name ?? (await generateUniqueName(Number(userId)))

        const flow = await db.$transaction(async tx => {
            const createdFlow = await tx.flow.create({
                data: {
                    userId,
                    name: finalName,
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            availableActionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.actionMetadata ?? {},
                        }))
                    }
                }
            });

            await tx.trigger.create({
                data: {
                    availableTriggerId: parsedData.data.availableTriggerId,
                    metadata: parsedData.data.triggerMetadata ?? {},
                    flowId: createdFlow.id
                }
            });

            return createdFlow;
        })

        return res.status(201).json({
            message: "Flow created",
            flowId: flow.id
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.id;

    const flows = await db.flow.findMany({
        where: {
            userId
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            }
        }
    })

    return res.json({
        flows
    })
})


router.get("/:flowId", authMiddleware, async (req, res) => {
    const userId = req.id
    const flow = await db.flow.findUnique({
        where: {
            id: req.params.flowId,
            userId
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })

    res.json({
        flow
    })
})


router.put("/:flowId", authMiddleware, async (req, res) => {
    const userId = req.id;
    const id = req.params.flowId;

    try {
        const body = req.body;
        const parsedData = FlowUpdateSchema.safeParse(body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Incorrect inputs"
            })
        }


        const flow = await db.$transaction(async tx => {

            await db.action.deleteMany({
                where: {
                    flowId: id,
                    flow: {
                        userId
                    }
                }
            })

            const updatedFlow = await tx.flow.update({
                where: {
                    id,
                    userId
                },
                data: {
                    name: parsedData.data.name,
                    actions: {
                        create: parsedData.data.actions?.map((x, index) => ({
                            availableActionId: x.availableActionId,
                            actionMetadata: x.actionMetadata ?? {},
                            sortingOrder: index
                        }))
                    }
                }
            })

            if (parsedData.data.availableTriggerId || parsedData.data.triggerMetadata) {
                await tx.trigger.update({
                    where: {
                        flowId: id
                    },
                    data: {
                        availableTriggerId: parsedData.data.availableTriggerId,
                        metadata: parsedData.data.triggerMetadata ?? {}
                    }
                });
            }

            return updatedFlow
        })

        res.status(200).json({
            message: "Flow updated successfully",
            flowId: flow.id
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }

})

router.delete("/:flowId", authMiddleware, async (req, res) => {
    const userId = req.id;
    const id = req.params.flowId;

    try {
        const flow = await db.flow.findUnique({
            where: {
                id,
                userId
            }
        })

        if (!flow) {
            return res.status(404).json({
                message: "Flow not found"
            })
        }

        await db.$transaction(async (tx) => {
            await tx.action.deleteMany({
                where: {
                    flowId: id
                }
            })

            await tx.trigger.deleteMany({
                where: {
                    flowId: id
                }
            })

            await tx.flow.delete({
                where: {
                    id
                }
            })
        })

        return res.status(200).json({
            message: "Flow deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})


export const flowRouter = router;
