import express, { Request, Response } from "express";
import createSchedule from "../../models/schedules/create_schedule/create_schedule";
import getActions from "../../models/schedules/get_actions/get_actions";
import getSchedule from "../../models/schedules/get_schedule/get_schedule";

const router = express.Router();

interface GetScheduleQuery extends Request {
    query: {
        orgId: string,
        role?: string
        date: string
    }
}

// Get schedule actions
router.get("/:teamId/actions", async (req: GetScheduleQuery, res: Response) => {
    const response = await getActions({
        orgId: req.query.orgId,
        teamId: req.params.teamId,
        role: req.query.role
    })
    res.json(response)
})

// Get schedule for specific day
router.get("/:teamId", async (req: GetScheduleQuery, res: Response) => {
    const response = await getSchedule({
        orgId: req.query.orgId,
        teamId: req.params.teamId,
        date: req.query.date
    })

    res.json(response)
})

// Create a new schedule
router.post("/:teamId/:memberId", async (req: Request, res: Response) => {
    const response = await createSchedule({
        orgId: req.body.orgId,
        teamId: req.params.teamId,
        memberId: req.params.memberId,
        scheduleId: req.body.scheduleId,
        schedule: req.body.schedule,
        date: req.body.date
    })

    res.json(response)
})

export default router