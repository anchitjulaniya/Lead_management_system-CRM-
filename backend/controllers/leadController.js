const Lead = require("../models/Lead");
const User = require("../models/User");
const notificationService = require("../services/notificationService");
const socketService = require("../services/socketService");
const mongoose = require("mongoose");

exports.createLead = async (req, res) => {
  console.log(req)
  try {
    if (!req.body.name || req.body.name.length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters"
      });
    }
const phoneRegex = /^[0-9]{10}$/;

if (!phoneRegex.test(req.body.phone)) {
  return res.status(400).json({
    message: "Invalid phone number"
  });
}

    
     if (req.body.assignedTo) {

      const user = await User.findById(req.body.assignedTo);

      if (!user || user.role !== "sales") {
        return res.status(400).json({
          message: "Lead must be assigned to a valid sales user"
        });
      }

    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.sub
    });
    
    
   
 if (lead.assignedTo) {
      await notificationService.createNotification(
        lead.assignedTo,
        `A new lead (${lead.name}) has been created`
      );
  }
    
    socketService.emit("leadCreated", lead);

    res.json({
      message: "Lead created successfully",
      lead
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};


exports.getLeads = async (req, res) => {

  try {

    let {
      q,
      status,
      source,
      assignedTo,
      createdFrom,
      createdTo,
      sort = "createdAt:desc",
      page = 1,
      limit = 10
    } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 100);

    const match = {};


    if (req.user.role === "sales") {
      const userId = new mongoose.Types.ObjectId(req.user.sub);

      match.$or = [
        { createdBy: userId },
        { assignedTo: userId }
      ];
    }

    if (q) {
      match.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } }
      ];
    }

    if (status) match.status = status;
    if (source) match.source = source;
    if (assignedTo) match.assignedTo = assignedTo;

    if (createdFrom || createdTo) {

      match.createdAt = {};

      if (createdFrom) {
        match.createdAt.$gte = new Date(createdFrom);
      }

      if (createdTo) {
        match.createdAt.$lte = new Date(createdTo);
      }

    }


    const [field, order] = sort.split(":");

    const sortStage = {
      [field]: order === "asc" ? 1 : -1,
      _id: -1
    };

    
    const results = await Lead.aggregate([

      { $match: match },

      {
        $facet: {

          data: [
            { $sort: sortStage },
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ],

          totalCount: [
            { $count: "count" }
          ]

        }

      }

    ]);

    const data = results[0].data;
    const total = results[0].totalCount[0]?.count || 0;

    res.json({

      data,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

exports.updateLead = async (req, res) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    console.log("Role:", req.user.role);

    if (
      req.user.role === "sales" &&
      lead.createdBy.toString() !== req.user.sub &&
      lead.assignedTo?.toString() !== req.user.sub
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const previousAssigned = lead.assignedTo?.toString();
    const previousStatus = lead.status;

    if (req.body.assignedTo) {

       const user = await User.findById(req.body.assignedTo);

      if (!user) {
        return res.status(404).json({
          message: "Assigned user not found"
        });
      }

      if (user.role !== "sales") {
        return res.status(400).json({
          message: "Lead can only be assigned to sales users"
        });
      }

      req.body.assignedTo = new mongoose.Types.ObjectId(req.body.assignedTo);
    }
    if (req.body.assignedTo === "") {
      delete req.body.assignedTo;
    }

    Object.assign(lead, req.body);

    await lead.save();

    socketService.emit("leadUpdated", lead);

    if (
      req.body.assignedTo &&
      req.body.assignedTo.toString() !== previousAssigned
    ) {

      await notificationService.createNotification(
        req.body.assignedTo,
        `A lead (${lead.name}) has been assigned to you`
      );

    }

    if (
      req.body.status &&
      req.body.status !== previousStatus &&
      lead.assignedTo
    ) {

      await notificationService.createNotification(
        lead.assignedTo,
        `Lead (${lead.name}) status changed to ${req.body.status}`
      );

    }

    res.json({
      message: "Lead updated",
      lead
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};

exports.deleteLead = async (req, res) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    if (
      req.user.role === "sales" &&
      lead.createdBy.toString() !== req.user.sub &&
      lead.assignedTo?.toString() !== req.user.sub
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    await lead.deleteOne();

    /*
      Notification should NOT break deletion
    */
    if (lead.assignedTo) {

      try {

        await notificationService.createNotification(
          lead.assignedTo,
          `Lead (${lead.name}) was deleted`
        );

      } catch (notificationError) {

        console.error("Notification error:", notificationError);

      }

    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully"
    });

  } catch (err) {

    console.error("Delete lead error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


exports.getStats = async (req, res) => {
  try {
    const { from, to } = req.query;

    const match = {};
    if (from && to) {
      match.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    const stats = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      message: "Stats retrieved",
      stats
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
