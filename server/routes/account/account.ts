import express, { Request, Response } from "express";
import validatePortalAccessToken from "../../middleware/access_tokens/portal/validate_token";
import accountLogin from "../../models/account/login/login";

const router = express.Router();

// Log in to account
router.post("/login", async (req: Request, res: Response) => {
    const response = await accountLogin(req.body);

    res.json(response)
})

// Validate URL path access
router.post("/path-access", validatePortalAccessToken, async (req: Request, res: Response) => {
    res.json({
        success: true
    })
})

export default router