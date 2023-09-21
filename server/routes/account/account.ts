import validateApiFields from "api-field-validation-middleware";
import express, { Request, Response } from "express";
import validatePortalAccessToken from "../../middleware/accessTokens/portal/validateToken";
import changePassword from "../../models/account/changePassword/changePassword";
import createAccount from "../../models/account/createAccount/createAccount";
import accountLogin from "../../models/account/login/login";
import validateEmailAddress from "../../models/account/validateEmailAddress/validateEmailAddress";
import { changePasswordValidation } from "./fieldValidation/changePassword";
import { createAccountValidation } from "./fieldValidation/createAccount";

const router = express.Router();

// Log in to account
router.post("/login", async (req: Request, res: Response) => {
    const response = await accountLogin(req.body);
    res.json(response)
})

// Change password
router.put("/change-password", validatePortalAccessToken, validateApiFields(changePasswordValidation), async (req: Request, res: Response) => {
    const response = await changePassword(req.user.organisation._id, req.user.userId, req.body)
    res.json(response)
})

// Validate URL path access
router.post("/path-access", validatePortalAccessToken, async (req: Request, res: Response) => {
    res.json({
        success: true
    })
})

// Create account
router.post("/setup", validateApiFields(createAccountValidation), async (req: Request, res: Response) => {
    const response = await createAccount(req.body);
    res.json(response)
})

// Verify email address (during account sign up process)
router.post("/setup/email-validation", async (req: Request, res: Response) => {
    const response = await validateEmailAddress(req.body.emailAddress);
    res.json(response);
})

export default router