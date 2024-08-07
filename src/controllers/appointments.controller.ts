import e, { Request, Response } from "express";
import { Appointment } from "../database/models/Appointment";

export const createAppointment = async (req: Request, res: Response) => {
    try {
        //1. Get the needed information
        const userID = req.tokenData.id;
        const { appDate, serviceID, artistID} = req.body

        //2. Check the obtained information
        if (!appDate || !serviceID || !artistID) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Date, Artist and Service cannot be empty!"
                }
            )
        }

        //3. Save info in our DataBase
        const newAppointment = await Appointment.create(
            {
                user_id: userID,
                appointment_date: new Date(appDate),
                service_id: serviceID,
                artist_id: artistID
            }
        ).save();

        //4. Give a response to the page
        res.status(201).json(
            {
                success: true,
                message: "Appointment created successfully!",
                data: newAppointment
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error creating new appointment!",
                error: error
            }
        )

    }
}

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        //1. Get the ID of the appointment we want to update
        const appointmentID = req.body.id;
        const body = req.body;

        //2. Verify the appID
        const appointment = await Appointment.findOne(
            {
                where: {
                    id: parseInt(appointmentID)
                }
            }
        )

        if (!appointment) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Appointment does not exist!"
                }
            )
        }

        //3. If finded app exist = update and save the info

        const updateApp = await Appointment.update(
            {
                id: parseInt(appointmentID)
            },
            body
        )

        //4. Response provide
        res.status(200).json(
            {
                success: true,
                message: "Appointment amended successfully!",
                data: updateApp
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error changing appointment information!",
                error: error
            }
        )

    }
}

export const showMyAppointments = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.id;

        // console.log(userId)
        const appointment = await Appointment.find(
            {
                select: {
                    id: true,
                    appointment_date: true,
                    user: {
                        id: true,
                        email: true
                    },
                    service: {
                        id: true,
                        service_name: true
                    },
                    artist: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        specialization: true,
                        style: true
                    }
                },
                where:
                {
                    user_id: userId
                },

                relations: { user: {}, service: {}, artist: {}}
            }
        );

        res.status(200).json(
            {
                success: true,
                message: "User appointments retrived successfully!",
                data: appointment
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                susscess: false,
                message: "User appointments cannot be retrived!",
                error: error
            }
        )
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const appID = req.params.id

        const appointment = await Appointment.findOneBy({
            id: parseInt(appID)
        })

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        const deletedApp = await Appointment.delete({
            id: parseInt(appID)
        }
        )

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully!",
            data: deletedApp
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Appointment cannot be deleted!",
            error: error
        })
    }
}

export const findAppointmendById = async (req: Request, res: Response) => {
    try {
        //1. Find the ID of the appointment
        const appId = req.body.id;
        const userID = req.tokenData.id;

        //2. Search app by ID in our database
        const appointment = await Appointment.findOne(
            {
                where: {
                    user: { id: userID },
                    id: parseInt(appId)
                },
                relations: { service: {} }
            }
        )

        if (!appId) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Appointment not found!"
                }
            )
        }

        //3. Provide response 
        res.json(
            {
                success: true,
                message: "Appointment retrived successfully!",
                data: appointment
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error finding appointment",
                error: error
            }
        )

    }
}
