const Lead = require("../models/Lead");
const notificationService = require("../services/notificationService");
const socketService = require("../services/socketService");



exports.createLead = async (req, res) => {

  try {

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.sub
    });

    // emit realtime event
    socketService.emit("leadCreated", lead);

    res.json({
      message: "Lead created",
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

    /*
    Role based restriction for sales
    */
    if (req.user.role === "sales") {
      match.$or = [
        { createdBy: req.user.sub },
        { assignedTo: req.user.sub }
      ];
    }

    /*
    Search
    */
    if (q) {
      match.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } }
      ];
    }

    /*
    Filters
    */
    if (status) match.status = status;
    if (source) match.source = source;
    if (assignedTo) match.assignedTo = assignedTo;

    /*
    Date filters
    */
    if (createdFrom || createdTo) {

      match.createdAt = {};

      if (createdFrom) {
        match.createdAt.$gte = new Date(createdFrom);
      }

      if (createdTo) {
        match.createdAt.$lte = new Date(createdTo);
      }

    }

    /*
    Sorting
    */
    const [field, order] = sort.split(":");

    const sortStage = {
      [field]: order === "asc" ? 1 : -1,
      _id: -1
    };

    /*
    Aggregation pipeline
    */
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

    /*
    Ownership check for sales role
    */
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

    /*
    Update lead fields
    */
    Object.assign(lead, req.body);

    await lead.save();

    /*
    Emit realtime update
    */
    socketService.emit("leadUpdated", lead);

    /*
    Notification: Lead assigned or reassigned
    */
    if (
      req.body.assignedTo &&
      req.body.assignedTo !== previousAssigned
    ) {

      await notificationService.createNotification(
        req.body.assignedTo,
        `A lead (${lead.name}) has been assigned to you`
      );

    }

    /*
    Notification: Status changed
    */
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

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    /*
    Emit realtime delete
    */
    socketService.emit("leadDeleted", req.params.id);

    res.json({
      message: "Lead deleted"
    });

  } catch (err) {

    res.status(500).json({
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
exports.getLeads = async (req, res) => {

  try {
    let { page = 1, limit = 10, q, status, source } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};
    if (q) {
      filter.$or = [

        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } } 
      ];
    }
    if (status) filter.status = status;
    if (source) filter.source = source;
    const total = await Lead.countDocuments
      (filter);
    const leads = await Lead.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};