import { HydratedDocument } from "mongoose"

class TransformObject {
    transformUser(_: HydratedDocument<unknown>, ret: Record<string, any>, options: any) {
        ret.id = ret._id;
        delete ret._id;

        return ret
    }
    transformTask(_: HydratedDocument<unknown>, ret: Record<string, any>) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.user;

        return ret
    }
   
}

export default new TransformObject();
