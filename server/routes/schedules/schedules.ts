import validateApiFields from "api-field-validation-middleware";
import express, { Request, Response } from "express";
import validatePortalAccessToken from "../../middleware/accessTokens/portal/validateToken";

// Models
import addSchedulePart from "../../models/schedules/addSchedulePart/addSchedulePart";
import createSchedule from "../../models/schedules/createSchedule/createSchedule";
import deleteSchedule from "../../models/schedules/deleteSchedule/deleteSchedule";
import deleteSchedulePart from "../../models/schedules/deleteSchedulePart/deleteSchedulePart";
import duplicateSchedule from "../../models/schedules/duplicateSchedule/duplicateSchedule";
import editSchedule from "../../models/schedules/editSchedule/editSchedule";
import editSchedulePart from "../../models/schedules/editSchedulePart/editSchedulePart";
import getActions from "../../models/schedules/getActions/getActions";
import getSchedule from "../../models/schedules/getSchedule/getSchedule";

// Validation
import { addNewPartValidation } from "./fieldValidation/addNewPart";
import { createScheduleValidation } from "./fieldValidation/createSchedule";
import { deletePartValidation } from "./fieldValidation/deletePart";
import { duplicateScheduleValidation } from "./fieldValidation/duplicateSchedule";
import { editSchedulePartValidation } from "./fieldValidation/editPart";
import { editScheduleValidation } from "./fieldValidation/editSchedule";

const router = express.Router();

interface GetScheduleQuery extends Request {
    query: {
        orgId: string,
        role?: string
        date: string
    }
}

// Get schedule actions
router.get("/:teamId/actions", validatePortalAccessToken, async (req: GetScheduleQuery, res: Response) => {
    const response = await getActions({
        orgId: req.user.organisation._id,
        teamId: req.params.teamId,
        role: req.query.role
    })
    res.json(response)
})

// Get schedule for specific day
router.get("/:teamId", validatePortalAccessToken, async (req: GetScheduleQuery, res: Response) => {
    const response = await getSchedule({
        orgId: req.user.organisation._id,
        teamId: req.params.teamId,
        date: req.query.date
    })

    res.json(response)
})

// Create a new schedule
router.post("/:teamId/:memberId", validatePortalAccessToken, validateApiFields(createScheduleValidation), async (req: Request, res: Response) => {
    const response = await createSchedule(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body
    )

    res.json(response)
})

// Add a new schedule part
router.put("/:teamId/:memberId/add-part", validatePortalAccessToken, validateApiFields(addNewPartValidation), async (req: Request, res: Response) => {
    const response = await addSchedulePart(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body.scheduleId,
        req.body.newPart
    )

    res.json(response)
})

// Delete schedule entry
router.delete("/:teamId/:memberId", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await deleteSchedule(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body.scheduleId
    )

    res.json(response)
})

// Delete schedule part
router.delete("/:teamId/:memberId/part", validatePortalAccessToken, validateApiFields(deletePartValidation), async (req: Request, res: Response) => {
    const response = await deleteSchedulePart(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body
    )

    res.json(response)
})

// Edit schedule
router.put("/:teamId/:memberId", validatePortalAccessToken, validateApiFields(editScheduleValidation), async (req: Request, res: Response) => {
    const response = await editSchedule(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body
    )

    res.json(response)
})

// Edit schedule part
router.put("/:teamId/:memberId/part", validatePortalAccessToken, validateApiFields(editSchedulePartValidation), async (req: Request, res: Response) => {
    const response = await editSchedulePart(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body
    )

    res.json(response)
})

// Duplicate schdeule
router.copy("/:teamId/:memberId", validatePortalAccessToken, validateApiFields(duplicateScheduleValidation), async (req: Request, res: Response) => {
    const response = await duplicateSchedule(
        req.user.organisation._id,
        req.params.teamId,
        req.params.memberId,
        req.body
    )

    res.json(response)
})

export default router