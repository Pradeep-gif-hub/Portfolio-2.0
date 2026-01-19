import mongoose from 'mongoose';



export interface IExploring {

    _id?: mongoose.Types.ObjectId;

    title: string;

    description?: string;

    isActive: boolean;

    order: number;

    createdAt?: Date;

    updatedAt?: Date;

}



const exploringSchema = new mongoose.Schema<IExploring>(

    {

        title: {

            type: String,

            required: true,

            trim: true,

        },

        description: {

            type: String,

            trim: true,

        },

        isActive: {

            type: Boolean,

            default: true,

        },

        order: {

            type: Number,

            required: true,

            default: 0,

        },

    },

    {

        timestamps: true,

    }

);



// Index for efficient querying

exploringSchema.index({ isActive: 1, order: 1 });
export const Exploring =
    mongoose.models.Exploring || mongoose.model<IExploring>('Exploring', exploringSchema);