import mongoose from "mongoose";
import MONGO_CONNECTION_STRING from "../../../configuration/mongoose/connectionString";
import duplicateSchedule from "./duplicateSchedule";

test("One date, all actions allowed", async () => {
    await mongoose.connect(MONGO_CONNECTION_STRING);

    const response = await duplicateSchedule(
        "649ec16cbfd5bc167148ce51",
        "649ec547bfd5bc167148ce58",
        "649ec2acbfd5bc167148ce54",
        {
            scheduleId: "64ca41a6dad0834bc8fdc94c",
            destinationUserId: "64c62116d5dc9f33d183d03e",
            dates: ["2023-08-02"]
        }
    )

    expect(response.success).toEqual(true)
})