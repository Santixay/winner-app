const Customer = require("../models/Customer.js");

module.exports = {
  getCustomers: async (req, res) => {
    try {
      // sort should look like this: { "field": "userId", "sort": "desc"}
      const { page = 1, pageSize = 50, sort = null, search = "" } = req.query;

      // formatted sort should look like { userId: -1 }
      const generateSort = () => {
        const sortParsed = JSON.parse(sort);
        const sortFormatted = {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
        };

        return sortFormatted;
      };
      const sortFormatted = Boolean(sort) ? generateSort() : {};
      // console.log("🚀 ~ file: customer.js:18 ~ getCustomers ~ sortFormatted", sortFormatted)

      const customers = await Customer.find({
        $and: [
          { validflag: true },
          {
            $or: [
              { name: { $regex: new RegExp(search, "i") } },
              { whatsapp: { $regex: new RegExp(search, "i") } },
            ],
          },
        ],
      })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize);

      // let aggregateQuery = [
      //   {
      //     $match: {
      //       $or: [
      //         { name: { $regex: new RegExp(search, "i") } },
      //         { whatsapp: { $regex: new RegExp(search, "i") } },
      //       ],
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "provinces",
      //       localField: "province_id",
      //       foreignField: "pr_id",
      //       as: "province",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "districts",
      //       localField: "district_id",
      //       foreignField: "dt_id",
      //       as: "distrcit",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "villages",
      //       localField: "village_id",
      //       foreignField: "vill_id",
      //       as: "village",
      //     },
      //   },
      // ];

      // if (Boolean(sort)) {
      //   aggregateQuery.push({ $sort: sortFormatted });
      // }

      // const customers = await Customer.aggregate(aggregateQuery)
      //   // .sort(sortFormatted)
      //   .skip(page * pageSize)
      //   .limit(pageSize);

      const total = await Customer.countDocuments({
        $and: [
          { validflag: true },
          {
            $or: [
              { name: { $regex: new RegExp(search, "i") } },
              { whatsapp: { $regex: new RegExp(search, "i") } },
            ],
          },
        ],
      });

      res.status(200).json({
        customers,
        total,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getCustomerId: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findOne({id: id});
      if(customer === null){
        res.status(202).json({message: 'data not found!'});
      } else {
        res.status(200).json(customer);
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  storeCustomer: async (req, res) => {
    try {
      let newId = await Customer.countDocuments({});
      req.body.id = newId + 100;
      Customer.create(req.body, (error, customer) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
        res
          .status(200)
          .json({
            status: 200,
            customer,
            message: "Customer has been created.",
          });
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  updateCustomer: (req, res) => {
    try {
      const {
        _id,
        name,
        whatsapp,
        province,
        district,
        village,
        remark,
        validflag,
      } = req.body;
      Customer.findByIdAndUpdate(
        { _id: _id },
        {
          $set: {
            name: name,
            whatsapp: whatsapp,
            province: province,
            district: district,
            village: village,
            remark: remark,
            validflag: validflag,
          },
        },
        (error, result) => {
          if (error) {
            return res.status(400).json({ message: error.message });
          }
          res.status(200).json({
            result,
            status: 200,
            message: `Customer [${name}] has been updated.`,
          });
        }
      );
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteCustomer: (req, res) => {
    try {
      const { id } = req.params;
      // console.log(req);

      Customer.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            validflag: false,
          },
        },
        (error, result) => {
          if (error) {
            return res.status(400).json({ message: error.message });
          }
          res.status(200).json({
            result,
            status: 200,
            message: `Customer [${id}] has been updated.`,
          });
        }
      );
      // Customer.deleteOne({ _id: id }, (error, result) => {
      //   if (error) {
      //     return res.status(400).json({ message: error.message });
      //   }
      //   res
      //     .status(200)
      //     .json({ result, status: 200, message: "Customer has been deleted." });
      // });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
