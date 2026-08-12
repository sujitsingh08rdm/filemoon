const FileModel = require("../model/file.model");

const fetchDashboard = async (req, res) => {
  try {
    const reports = await FileModel.aggregate([
      { $group: { _id: "$type", total: { $sum: 1 } } },
      //   {
      //     $project: {
      //       type: "$_id",
      //       total: 1,
      //       _id: 0,
      //     },
      //   },
      //   above commneted code will se more comute power so ignore it.
    ]);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchDashboard };
