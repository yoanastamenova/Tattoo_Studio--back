import { Request, Response } from "express";
import { User } from "../database/models/User";
import bcrypt from 'bcrypt';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        //1. Retrive all of the users
        const users = await User.find(
            {
                select: {
                    email: true,
                    created_at: true,
                    id: true
                }
            }
        )

        //2. Provide a response
        res.json(
            {
                success: true,
                message: "All users retrived successfully!",
                data: users
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error showing all users!",
                error: error
            }
        )
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        //1. get the needed user ID
        const userId = req.tokenData.id;

        //2. Look for this ID in our DB

        const user = await User.findOne(
            {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    created_at: true,
                    updated_at: true
                },
                where: {
                    id: userId
                }
            }
        )

        //3. Provide a response
        res.json(
            {
                success: true,
                message: "Welcome to your profile!",
                data: user
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error opening user profile!"
            }
        )
    }
}

export const modifyUserProfile = async (req: Request, res: Response) => {
    try {
      // 1. Get the user ID from the token and the info we want to update from the body
      console.log(req.tokenData.id, req.body)
      // 2. Save it in the database
      const user = await User.update(
        {
          id: req.tokenData.id
        },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email
        }
      )
  
      res.json(
        {
          success: true,
          message: "Profile updated",
          data: user
        }
      )
  
    } catch (error) {
      res.status(500).json(
        {
          success: false,
          message: "Error updating profile",
          error: error
        }
      )
    }
  }
//////// EXTRA CRUD

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        //1. get the needed user ID
        const userId = req.tokenData.id;

        //2. Look for this ID in our DB

        const user = await User.findOne(
            {
                select: {
                    email: true,
                    created_at: true,
                },
                where: {
                    id: userId
                }
            }
        )

        //3. Provide a response
        res.json(
            {
                success: true,
                message: "User with selected email retrived successfuly!",
                data: user
            }
        )

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Error opening selected user with selected email!",
                error: error
            }
        )
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        //1. Retrive the id for the user which we want to update
        const { userId, newRoleId } = req.body;
        
        //2. Validate this info (see if our user exxists)

        const user = await User.findOne({
            where: {
                id: userId
            }
    })
    console.log(user)
        if(!user){
            return res.status(404).json(
                {
                    success: false,
                    message: "User not found!"
                }
            )
        }

        //3. Update the info in our DataBase

        user.role_id = newRoleId;

        const userUpdated = await user.save()

        const response = {
            userId: userUpdated.id,
            email: userUpdated.email,
            updatedAt: userUpdated.updated_at,
            role: newRoleId
        }
        
        //4. Provide a response to the web page
        res.status(200).json(
            {
                success: true,
                message: "User role updated successfully!",
                data: response
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "User cannot be updated! Try again!",
                error: error
            }
        )
    }
}

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const userID = req.params.id

        const user = await User.findOneBy({
            id: parseInt(userID)
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found! Check ID!"
            })
        }

        const deletedUser = await User.delete({
            id: parseInt(userID)
        }
        )

        return res.status(200).json({
            success: true,
            message: "User was deleted successfully!",
            data: deletedUser
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User can't be deleted",
            error: error
        })
    }
}