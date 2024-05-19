import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import sendInterviewNotification from '../feat/mail.js'
import moment from 'moment'

const scheduleInterview = async (req, res) => {
  try {
    const { link, dateString, startedAt, endsAt, interviewID } = req.body;

    const { id: _id } = req.params;
    console.log(_id);

    if (!link || !dateString || !startedAt || !endsAt || !interviewID || !_id) {
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
    console.log(year, month, day);
    const [startHours, startMinutes] = startedAt.split(":").map(Number);
    console.log(startHours, startMinutes);
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
      },
    });
    console.log(interview);

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

    console.log("student", student, "interviewer", interview);

    const formattedDate = moment(interview.date).format('YYYY-MM-DD');
    const formattedTime = moment(interview.startedAt).format('hh:mm A');

    //mail sending feat

    sendInterviewNotification(
      "sumitpadalkar08@gmail.com",
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
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { technical, communication, behaviour, apperance, feedbacks } =
      req.body;

    const { id: _id } = req.params;

    if (!technical || !communication || !behaviour || !apperance || feedback) {
      return res.status(400).json({
        success: false,
        msg: "Please provide all details",
      });
    }

    const technicalNum = parseInt(technical, 10);
    const communicationNum = parseInt(communication, 10);
    const behaviourNum = parseInt(behaviour, 10);
    const apperanceNum = parseInt(apperance, 10);

    const feedback = await prisma.feedback.create({
      data: {
        technical: technicalNum,
        communication: communicationNum,
        behaviour: behaviourNum,
        apperance: apperanceNum,
        feedback: feedbacks,
      },
    });

    const interview = await prisma.interview.update({
      where: {
        id: _id,
      },
      data: {
        feedback: {
          connect: {
            id: feedback.id,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Feedback created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { id: _id } = req.params;

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
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const getAllInterviews = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { filter } = req.query;


    
    if (filter === "today") {
      const date = new Date();
      const interview = await prisma.interview.findMany({
        where: {
          date: date,
          studentId: _id,
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
            gt: upcomingDay,
          },
          studentId: _id,
        },
      });

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
            lt: previousDay,
          },
          studentId: _id,
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
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export { scheduleInterview, getFeedback, createFeedback, getAllInterviews };
