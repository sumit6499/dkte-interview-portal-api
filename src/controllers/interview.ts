import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import sendInterviewNotification from "../feat/mail";
import moment from "moment";
import { Request,Response } from "express";
import {winstonLogger as logger} from '../middleware/logger'
import dotenv from 'dotenv'
dotenv.config()

const scheduleInterview = async (req:Request, res:Response) => {
  try {
    const { link, dateString, startedAt, endsAt, interviewID,facultyID } = req.body;

    const { id: _id } = req.params;

    if (!link || !dateString || !startedAt || !endsAt || !interviewID || !_id ||!facultyID) {
      return res.status(400).json({
        success: false,
        msg: "Please provide all details",
      });
    }

    const existingUser = await prisma.student.findFirst({
      where: {
        id: _id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "No such student exist",
      });
    }

    const [year, month, day] = dateString.split("-").map(Number);
    const [startHours, startMinutes] = startedAt.split(":").map(Number);
    const [endHours, endMinutes] = endsAt.split(":").map(Number);

    const date = new Date(year, month - 1, day);
    const startTime = new Date(year, month - 1, day, startHours, startMinutes);
    const endTime = new Date(year, month - 1, day, endHours, endMinutes);

    const interview = await prisma.interview.create({
      data: {
        link: link,
        date: date,
        startedAt: startTime,
        endsAt: endTime,
        facultyId:facultyID
      },
    });

    const student = await prisma.student.update({
      where: {
        id: _id,
      },
      data: {
        interviews: {
          connect: {
            id: interview.id,
          },
        },
      },
    });

    const interviewer = await prisma.interviewer.update({
      where: {
        id: interviewID,
      },
      data: {
        interviews: {
          connect: {
            id: interview.id,
          },
        },
      },
    });

   


    const formattedDate = moment(interview.date).format("YYYY-MM-DD");
    const formattedTime = moment(interview.startedAt).format("hh:mm A");

    //mail sending feat

    sendInterviewNotification(
      process.env.MAIL_USER_ID,
      `${student.email} , ${interviewer.email}`,
      `${student.name}`,
      `${interviewer.name}`,
      `${interview.link}`,
      `${formattedDate}`,
      `${formattedTime}`
    );

    return res.status(200).json({
      success: true,
      msg: "Interview scheduled successfully",
    });
  } catch (error) {
    logger.error(JSON.stringify(error))
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const createFeedback = async (req:Request, res:Response) => {
  try {
    const {
      technical,
      communication,
      behaviour,
      apperance,
      feedback: feedbackText,
    } = req.body;
    const { id: _id } = req.params;

    if (
      !technical ||
      !communication ||
      !behaviour ||
      !apperance ||
      !feedbackText
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide all details",
      });
    }

    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        interviewId: _id,
      },
    });


    if (existingFeedback) {
      return res.status(409).json({
        success: true,
        msg: "Feedback can't be submitted more than once",
      });
    }

    const technicalNum = parseInt(technical, 10);
    const communicationNum = parseInt(communication, 10);
    const behaviourNum = parseInt(behaviour, 10);
    const apperanceNum = parseInt(apperance, 10);

    const newFeedback = await prisma.feedback.create({
      data: {
        technical: technicalNum,
        communication: communicationNum,
        behaviour: behaviourNum,
        apperance: apperanceNum,
        feedback: feedbackText,
        interviewId: _id,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Feedback created successfully",
    });
  } catch (error) {
    logger.error(JSON.stringify(error))
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const getFeedback = async (req:Request, res:Response) => {
  try {
    const { id: _id } = req.params;

    const interviews=await prisma.interview.findMany({
      include:{
        feedback:true
      }
    })


    const feedback = await prisma.interview.findFirst({
      where: {
        id: _id,
      },
      include: {
        feedback: true,
      },
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        msg: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Feedback fetched successfully",
      data: feedback,
    });
  } catch (error) {
    logger.error(JSON.stringify(error))
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const getInterviews = async (req:Request, res:Response) => {
  try {
    const { id: _id } = req.params;
    const { filter } = req.query;
    if (filter === "today") {
      const date = new Date();
      const interview = await prisma.interview.findMany({
        where: {
          date: date,
          OR: [
            {
              studentId: _id,
            },
            {
              interviewerId: _id,
            },
            {
              facultyId: _id,
            },
          ],
        },
      });


      if (!interview) {
        return res.status(404).json({
          success: false,
          msg: "No interview found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Interview fetched successfully",
        data: interview,
      });
    }

    if (filter === "upcoming") {
      const upcomingDay = new Date();
      upcomingDay.setDate(upcomingDay.getDate() + 1);

      const upcomingInterview = await prisma.interview.findMany({
        where: {
          date: {
            gte: upcomingDay,
          },
          OR: [
            {
              studentId: _id,
            },
            {
              interviewerId: _id,
            },
            {
              facultyId: _id,
            },
          ],
        },
      });

      console.log(upcomingInterview)
      if (!upcomingInterview) {
        return res.status(404).json({
          success: false,
          msg: "No upcoming interview found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Upcoming interview fetched successfully",
        data: upcomingInterview,
      });
    }

    if (filter === "previous") {
      const previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1);

      const previousInterview = await prisma.interview.findMany({
        where: {
          date: {
            lte: previousDay,
          },
          OR: [
            {
              studentId: _id,
            },
            {
              interviewerId: _id,
            },
            {
              facultyId: _id,
            },
          ],
        },
      });

      if (!previousInterview) {
        return res.status(404).json({
          success: false,
          msg: "No previous interview",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Previous interview fetched successfully",
        data: previousInterview,
      });
    }
    return res.status(400).json({
      success: false,
      msg: "Filter value invalid",
    });
  } catch (error) {
    logger.error(JSON.stringify(error))
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export { scheduleInterview, getFeedback, createFeedback, getInterviews };
