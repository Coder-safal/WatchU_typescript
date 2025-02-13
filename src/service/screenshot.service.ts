import mongoose from "mongoose";
import Screenshot, { IScreenshoot } from "../model/Screenshot";
import Timesheet, { ITimesheet } from "../model/Timesheet";
import ApiError from "../utils/apiError";

class ScreehshotService {
  uploadScreenshot = async (
    image: string,
    timestampId: mongoose.Types.ObjectId,
    employeId: mongoose.Types.ObjectId
  ): Promise<void> => {
    // if Session is running then only allowed to upload screenshot

    let timesheet: ITimesheet | null = await Timesheet.findOne({
      _id: timestampId,
      isRunning: true,
    });

    if (!timesheet) {
      throw new ApiError(400, "Session isn't start");
    }

    let screenshot: IScreenshoot | null;

    screenshot = await Screenshot.findOne({ timestampId });

    if (!screenshot) {
      screenshot = await Screenshot.create({ timestampId, employeId });
    }

    screenshot.images.push(image);

    await screenshot.save({ validateBeforeSave: false });
    return;
  };
}

export default new ScreehshotService();
