import validateApiFields from "api-field-validation-middleware";
import express, { Request, Response } from "express";
import validatePortalAccessToken from "../../middleware/access_tokens/portal/validate_token";
import addNewDepartment from "../../models/organisation/departments/add_department/add_department";
import deleteDepartment from "../../models/organisation/departments/delete_department/delete_department";
import getDepartments from "../../models/organisation/departments/get_departments/get_departments";
import renameDepartment from "../../models/organisation/departments/rename_department/rename_department";
import addNewTeam from "../../models/organisation/teams/add_team/add_team";
import getTeams from "../../models/organisation/teams/get_teams/get_teams";
import getTeamById from "../../models/organisation/teams/get_team_by_id/get_team_by_id";
import getUsers from "../../models/organisation/users/get_users/get_users";
import { addTeamValidation } from "./field_validation/add_team";

const router = express.Router();

// -- DEPARTMENTS -- //
// Get all departments
router.get("/departments", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await getDepartments(req.user.organisation._id)
    res.json(response)
})

// Add new department
router.post("/departments", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await addNewDepartment({
        organisation: req.user.organisation,
        departmentName: req.body.departmentName
    })

    res.json(response)
})

// Delete department
router.delete("/departments/:dptId", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await deleteDepartment({
        orgId: req.user.organisation._id,
        dptId: req.params.dptId
    })

    res.json(response)
})

// Rename department
router.put("/departments/:dptId", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await renameDepartment({
        orgId: req.user.organisation._id,
        dptId: req.params.dptId,
        newName: req.body.newName
    })

    res.json(response)
})

// -- TEAMS -- //
interface GetTeamsRequest extends Request {
    query: {
        dptId: string
    }
}

// Add new team
router.post("/teams", validatePortalAccessToken, validateApiFields(addTeamValidation), async (req: Request, res: Response) => {
    const response = await addNewTeam(req.body, req.user)
    res.json(response)
})

// Get all teams
router.get("/teams", validatePortalAccessToken, async (req: GetTeamsRequest, res: Response) => {
    const response = await getTeams({
        dptId: req.query.dptId,
        orgId: req.user.organisation._id
    })

    res.json(response)
})

// Get team by Id
router.get("/teams/:teamId", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await getTeamById({
        teamId: req.params.teamId,
        orgId: req.user.organisation._id
    })

    res.json(response)
})

// -- USERS -- //
interface GetUsersRequest extends Request {
    query: {
        teamId?: string,
        abbreviated?: string
    }
}

// Get all users
router.get("/users", validatePortalAccessToken, async (req: GetUsersRequest, res: Response) => {
    const response = await getUsers({
        teamId: req.query.teamId,
        orgId: req.user.organisation._id,
        abbreviated: req.query.abbreviated === "true" ? true : false
    })

    res.json(response)
})

export default router;