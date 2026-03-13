const Lead = require("../models/Lead");

exports.getSummary = async (req, res) => {

  try {

    const { createdFrom, createdTo } = req.query;

    const match = {};

    if (createdFrom || createdTo) {
      match.createdAt = {};

      if (createdFrom) match.createdAt.$gte = new Date(createdFrom);
      if (createdTo) match.createdAt.$lte = new Date(createdTo);
    }

    const stats = await Lead.aggregate([

      { $match: match },

      {
        $facet: {

          totalLeads: [
            { $count: "count" }
          ],

          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ],

          bySource: [
            {
              $group: {
                _id: "$source",
                count: { $sum: 1 }
              }
            }
          ]

        }
      }

    ]);

    const result = stats[0];

    const format = (arr) => {
      const obj = {};
      arr.forEach(i => {
        obj[i._id] = i.count;
      });
      return obj;
    };

    res.json({

      totalLeads: result.totalLeads[0]?.count || 0,

      byStatus: format(result.byStatus),

      bySource: format(result.bySource)

    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};