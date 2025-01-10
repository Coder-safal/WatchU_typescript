import mongoose from "mongoose";
import Screenshot, { IScreenshoot } from '../model/Screenshot';


class ScreehshotService {

    uploadScreenshot = async (image: string, timestampId: mongoose.Types.ObjectId, employeId: mongoose.Types.ObjectId): Promise<void> => {

        let screenshot: IScreenshoot | null;

        screenshot = await Screenshot.findOne({ timestampId });

        if (!screenshot) {
            screenshot = await Screenshot.create({ timestampId, employeId });
        }


        screenshot.images.push(image);

        await screenshot.save({ validateBeforeSave: false });
        return;

    }
}

export default new ScreehshotService();