import { Router } from "express";
import client from "@repo/db/client"
import { SigninSchema, SignupSchema } from "../types";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_MS } from "../config/auth.config";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "secret2";


const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body);

        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            });
        }

        const userExists = await client.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (userExists) {
            return res.status(400).json({
                message: "User already Exists"
            })
        }

        let hashedPassword = null;
        if (body.provider === "LOCAL") {
            if (!body.password) {
                return res.status(400).json({
                    message: "Password is required"
                });
            }
            hashedPassword = await bcrypt.hash(body.password, 10);
        }

        const newUser = await client.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword,
                provider: body.provider,
                providerId: body.provider === "GOOGLE" ? body.providerId : null,
            },
        });

        res.status(200).json({
            message: "User created Successfully"
        })
    } catch (error) {
        console.error("Signup Error:", error)
        res.status(500).json({
            message: "Signup Failed"
        })
    }
})

router.post("/signin", async (req, res) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Incorrect Inputs"
            })
        }

        const user = await client.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }


        if (user.provider === "LOCAL") {
            if (!user.password || !body.password) {
                return res.status(400).json({
                    message: "Password is required"
                })
            }
            const validPassword = await bcrypt.compare(body.password, user.password)
            if (!validPassword) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email
        },
            ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
        )

        const refreshToken = jwt.sign({
            id: user.id
        },
            REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
        )

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await client.refreshToken.upsert({
            where: {
                userId: user.id
            },
            update: {
                refreshTokenHash: hashedRefreshToken,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            },
            create: {
                userId: user.id,
                refreshTokenHash: hashedRefreshToken,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            }
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: REFRESH_TOKEN_EXPIRY_MS,
        });


        res.status(200).json({ accessToken });
    } catch (error: any) {
        console.error("Signin Error:", error.message || error)
        res.status(500).json({
            message: "Signin Failed",
            error: error.message
        })
    }
})

router.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required " })
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number };

        const storedToken = await client.refreshToken.findUnique({
            where: {
                userId: decoded.id
            }, include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (!storedToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            })
        }

        if (new Date() > storedToken.expiresAt) {
            return res.status(403).json({
                message: "Refresh token expired"
            })
        }

        const isValid = await bcrypt.compare(refreshToken, storedToken.refreshTokenHash);
        if (!isValid) {
            return res.status(403).json({
                message: "Invalid refresh token"
            })
        }

        const newAccessToken = jwt.sign({
            id: storedToken.userId,
            email: storedToken.user.email
        }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY
        })

        const newRefreshToken = jwt.sign({
            id: storedToken.userId,
        }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY
        })

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
        await client.refreshToken.update({
            where: {
                userId: storedToken.userId
            },
            data: {
                refreshTokenHash: newRefreshTokenHash,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS)
            }
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: REFRESH_TOKEN_EXPIRY_MS
        });

        res.status(200).json({
            accessToken: newAccessToken
        })
    } catch (error: any) {
        console.error("Refresh Token Error:", error.message || error)
        res.status(403).json({
            message: "Invalid refresh token"
        })
    }
});

router.post("/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "NO refresh token provided"
            })
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: number };

        await client.refreshToken.deleteMany({
            where: {
                userId: decoded.id
            }
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });

        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (error: any) {
        console.error("Logout Error:", error.message || error);
        res.status(500).json({
            message: "Logout failed"
        })
    }
})


export const userRouter = router;