import validateApiFields from "api-field-validation-middleware";
import express, { Request, Response } from "express";
import validatePortalAccessToken from "../../middleware/accessTokens/portal/validateToken";

// Models
import addNewDepartment from "../../models/organisation/departments/addDepartment/addDepartment";
import deleteDepartment from "../../models/organisation/departments/deleteDepartment/deleteDepartment";
import getDepartments from "../../models/organisation/departments/getDepartments/getDepartments";
import renameDepartment from "../../models/organisation/departments/renameDepartment/renameDepartment";
import addNewAction from "../../models/organisation/teams/addAction/addAction";
import addNewRole from "../../models/organisation/teams/addRole/addRole";
import addNewTeam from "../../models/organisation/teams/addTeam/addTeam";
import addUser from "../../models/organisation/teams/addUser/addUser";
import deleteAction from "../../models/organisation/teams/deleteAction/deleteAction";
import deleteRole from "../../models/organisation/teams/deleteRole/deleteRole";
import deleteTeam from "../../models/organisation/teams/deleteTeam/deleteTeam";
import editAction from "../../models/organisation/teams/editAction/editAction";
import editRole from "../../models/organisation/teams/editRole/editRole";
import editTeam from "../../models/organisation/teams/editTeam/editTeam";
import getTeams from "../../models/organisation/teams/getTeams/getTeams";
import getTeamById from "../../models/organisation/teams/getTeamById/getTeamById";
import editUser from "../../models/organisation/users/editUser/editUser";
import getUsers from "../../models/organisation/users/getUsers/getUsers";

// Validation
import { addActionValidation } from "./fieldValidation/addAction";
import { addTeamValidation } from "./fieldValidation/addTeam";
import { addUserValidation } from "./fieldValidation/addUser";
import { deleteActionValidation } from "./fieldValidation/deleteAction";
import { editActionValidation } from "./fieldValidation/editAction";
import { editRoleValidation } from "./fieldValidation/editRole";
import { editTeamValidation } from "./fieldValidation/editTeam";
import { editUserValidation } from "./fieldValidation/editUser";

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

// Add new action
router.post("/teams/:teamId/actions", validatePortalAccessToken, validateApiFields(addActionValidation), async (req: Request, res: Response) => {
    const response = await addNewAction(
        req.user.organisation._id,
        req.params.teamId,
        req.body
    )

    res.json(response)
})

// Edit action
router.put("/teams/:teamId/actions", validatePortalAccessToken, validateApiFields(editActionValidation), async (req: Request, res: Response) => {
    const response = await editAction(
        req.user.organisation._id,
        req.params.teamId,
        req.body
    )

    res.json(response)
})

// Delete action
router.delete("/teams/:teamId/actions", validatePortalAccessToken, validateApiFields(deleteActionValidation), async (req: Request, res: Response) => {
    const response = await deleteAction({
        teamId: req.params.teamId,
        orgId: req.user.organisation._id,
        action: req.body.action
    })

    res.json(response)
})

// Add role
router.post("/teams/:teamId/roles", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await addNewRole(
        req.user.organisation._id,
        req.params.teamId,
        req.body.newRole
    )

    res.json(response);
})

// Edit role
router.put("/teams/:teamId/roles", validatePortalAccessToken, validateApiFields(editRoleValidation), async (req: Request, res: Response) => {
    const response = await editRole(
        req.user.organisation._id,
        req.params.teamId,
        req.body
    )

    res.json(response);
})

// Delete role
router.delete("/teams/:teamId/roles", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await deleteRole(
        req.user.organisation._id,
        req.params.teamId,
        req.body.role
    )

    res.json(response);
})

// Delete team
router.delete("/teams/:teamId", validatePortalAccessToken, async (req: Request, res: Response) => {
    const response = await deleteTeam({
        teamId: req.params.teamId,
        orgId: req.user.organisation._id
    })

    res.json(response)
})

// Edit team
router.put("/teams/:teamId", validatePortalAccessToken, validateApiFields(editTeamValidation), async (req: Request, res: Response) => {
    const response = await editTeam(
        req.user.organisation._id,
        req.params.teamId,
        req.body
    )

    res.json(response)
})


// -- USERS -- //
interface GetUsersRequest extends Request {
    query: {
        teamId?: string,
        status?: string,
        abbreviated?: string
    }
}

// Get all users
router.get("/users", validatePortalAccessToken, async (req: GetUsersRequest, res: Response) => {
    const response = await getUsers({
        teamId: req.query.teamId,
        orgId: req.user.organisation._id,
        status: req.query.status,
        abbreviated: req.query.abbreviated === "true" ? true : false
    })

    res.json(response)
})

// Create new user
router.post("/users", validatePortalAccessToken, validateApiFields(addUserValidation), async (req: Request, res: Response) => {
    const response = await addUser(
        req.user.organisation,
        req.body
    )

    res.json(response)
})

// Edit user
router.put("/users/:userId", validatePortalAccessToken, validateApiFields(editUserValidation), async (req: Request, res: Response) => {
    const response = await editUser(
        req.user.organisation._id,
        req.params.userId,
        req.body
    )

    res.json(response)
})

export default router;