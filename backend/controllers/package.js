const Package = require("../models/Package.js");

const initialQuery = [
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "id",
      as: "customer",
    },
  },
  {
    $project: {
      tracking: 1,
      description: 1,
      orderId: 1,
      amount: 1,
      quantity: 1,
      shippingFee: 1,
      routeId: 1,
      station: 1,
      status: 1,
      remark: 1,
      paymentStatus: 1,
      whatsappStatus: 1,
      updatedAt: 1,
      customer: { $arrayElemAt: ["$customer", 0] },
    },
  },
];

module.exports = {
  getPackages: async (req, res) => {
    try {
      // sort should look like this: { "field": "userId", "sort": "desc"}
      const { page = 0, pageSize = 50, sort = null, search = "" } = req.query;

      // formatted sort should look like { userId: -1 }
      const generateSort = () => {
        const sortParsed = JSON.parse(sort);
        const sortFormatted = {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
        };

        return sortFormatted;
      };
      const sortFormatted = Boolean(sort) ? generateSort() : {};

      // const packages = await Package.find({
      //   $or: [
      //     { description: { $regex: new RegExp(search, "i") } },
      //     { tracking: { $regex: new RegExp(search, "i") } },
      //     { orderId: { $regex: new RegExp(search, "i") } },
      //     { "customer.name": { $regex: new RegExp(search, "i") } },
      //   ],
      // })
      //   .sort(sortFormatted)
      //   .skip(page * pageSize)
      //   .limit(pageSize);

      let aggregateQuery = [
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "id",
            as: "customer",
          },
        },
        {
          $project: {
            tracking: 1,
            description: 1,
            orderId: 1,
            amount: 1,
            quantity: 1,
            shippingFee: 1,
            routeId: 1,
            station: 1,
            status: 1,
            remark: 1,
            paymentStatus: 1,
            whatsappStatus: 1,
            updatedAt: 1,
            customer: { $arrayElemAt: ["$customer", 0] },
          },
        },
        {
          $match: {
            $or: [
              { description: { $regex: new RegExp(search, "i") } },
              { tracking: { $regex: new RegExp(search, "i") } },
              { orderId: { $regex: new RegExp(search, "i") } },
              { "customer.name": { $regex: new RegExp(search, "i") } },
            ],
          },
        },
      ];

      if (Boolean(sort)) {
        aggregateQuery.push({ $sort: sortFormatted });
      }

      aggregateQuery.push(
        {
          $skip: parseInt(page * pageSize),
        },
        {
          $limit: parseInt(pageSize),
        }
      );

      const packages = await Package.aggregate(aggregateQuery);
      // .skip(page * pageSize)
      // .limit(pageSize);

      const total = await Package.countDocuments({
        name: { $regex: search, $options: "i" },
      });

      res.status(200).json({
        packages,
        total,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getPackageDetailById: async (req, res) => {
    try {
      const { id } = req.params;
      const packageDetail = await Package.findById(id);
      res.status(200).json(packageDetail);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getPackageDetailByTracking: async (req, res) => {
    try {
      const { tracking } = req.query;
      // console.log(tracking);

      // const packageDetail = await Package.findOne({ tracking: tracking });
      let aggregateQuery = [
        ...initialQuery,
        {
          $match: { tracking: tracking },
        },
      ];

      const packageDetail = await Package.aggregate(aggregateQuery);
      // console.log(packageDetail);
      if (packageDetail === null || packageDetail.length === 0) {
        console.log("Tracking number not found");
        res.status(204).json({ message: "Tracking number not found" });
      } else {
        res.status(200).json(packageDetail[0]);
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getPackageListByStationAndDate: async (req, res) => {
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
      const sortFormatted = Boolean(sort) ? generateSort() : { updatedAt: -1 };

      //Filter by station and date part
      let { from = "", to = "", station = "" } = req.query;
      // Set default date to current date if params are incorrect or null
      if (from.length !== 10 || isNaN(Date.parse(from))) {
        from = new Date().toISOString().slice(0, 10);
      } else {
        let newDate = new Date(Date.parse(from));
        // Convert time zone to UTC by -7 (Due to Vientiane time is +7:00 ahead from UTC)
        newDate = new Date(newDate.setHours(newDate.getHours() - 7));
        from = newDate;
      }

      if (to.length === 10 && !isNaN(Date.parse(to))) {
        let date = Date.parse(to);
        date = date + 3600 * 1000 * 24;
        to = new Date(date).toISOString().slice(0, 10);
      } else {
        to = new Date(Date.now() + 3600 * 1000 * 24).toISOString().slice(0, 10);
      }

      console.log(from, to);
      console.log(station);
      if (station.length !== 0) {
        // const packages = await Package.find({
        //   $and: [
        //     {
        //       updatedAt: {
        //         $gte: from,
        //         $lt: to,
        //       },
        //     },
        //     { station: station },
        //     {
        //       $or: [
        //         { description: { $regex: new RegExp(search, "i") } },
        //         { tracking: { $regex: new RegExp(search, "i") } },
        //         { orderId: { $regex: new RegExp(search, "i") } },
        //         { "customer.name": { $regex: new RegExp(search, "i") } },
        //       ],
        //     },
        //   ],
        // })
        //   .sort(sortFormatted)
        //   .skip(page * pageSize)
        //   .limit(pageSize);

        let aggregateQuery = [
          ...initialQuery,
          {
            $match: {
              $and: [
                {
                  updatedAt: {
                    $gte: from,
                    // $lt: to,
                  },
                },
                { station: station },
                {
                  $or: [
                    { description: { $regex: new RegExp(search, "i") } },
                    { tracking: { $regex: new RegExp(search, "i") } },
                    { orderId: { $regex: new RegExp(search, "i") } },
                    { "customer.name": { $regex: new RegExp(search, "i") } },
                  ],
                },
              ],
            },
          },
        ];

        if (Boolean(sort)) {
          aggregateQuery.push({ $sort: sortFormatted });
        }

        aggregateQuery.push(
          {
            $skip: parseInt(page * pageSize),
          },
          {
            $limit: parseInt(pageSize),
          }
        );

        const packages = await Package.aggregate(aggregateQuery);

        const totalCount = await Package.countDocuments({
          $and: [
            {
              updatedAt: {
                $gte: from,
                // $lt: to,
              },
            },
            { station: station },
            {
              $or: [
                { description: { $regex: new RegExp(search, "i") } },
                { tracking: { $regex: new RegExp(search, "i") } },
                { orderId: { $regex: new RegExp(search, "i") } },
                { "customer.name": { $regex: new RegExp(search, "i") } },
              ],
            },
          ],
        });
        res.status(200).json({
          packages,
          totalCount,
        });
      } else {
        const packages = await Package.find({
          $and: [
            {
              updatedAt: {
                $gte: from,
                $lt: to,
              },
            },
            {
              $or: [
                { description: { $regex: new RegExp(search, "i") } },
                { tracking: { $regex: new RegExp(search, "i") } },
                { orderId: { $regex: new RegExp(search, "i") } },
                { "customer.name": { $regex: new RegExp(search, "i") } },
              ],
            },
          ],
        })
          .sort(sortFormatted)
          .skip(page * pageSize)
          .limit(pageSize);
        const totalCount = await Package.countDocuments({
          $and: [
            {
              updatedAt: {
                $gte: from,
                $lt: to,
              },
            },
            {
              $or: [
                { description: { $regex: new RegExp(search, "i") } },
                { tracking: { $regex: new RegExp(search, "i") } },
                { orderId: { $regex: new RegExp(search, "i") } },
                { "customer.name": { $regex: new RegExp(search, "i") } },
              ],
            },
          ],
        });
        res.status(200).json({
          packages,
          totalCount,
        });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getSumPackagesForWhatsApp: async (req, res) => {
    try {
      const { station, search = "" } = req.query;
      var sumPackages = await Package.aggregate([
        ...initialQuery,
        {
          $match: {
            $and: [
              { station: station },
              { whatsappStatus: false },
              { "customer.name": { $regex: new RegExp(search, "i") } },
            ],
          },
        },
        {
          $group: {
            _id: { customer: "$customer" },
            totalPackages: { $sum: 1 },
            totalShippingFee: { $sum: "$shippingFee" },
          },
        },
      ]);
      if (sumPackages.length !== 0) {
        // Get SMS Message for each packages
        for (let index = 0; index < sumPackages.length; index++) {
          const element = sumPackages[index];
          const customer = element._id.customer;

          const packages = await Package.aggregate([
            ...initialQuery,
            {
              $match: {
                $and: [
                  { station: station },
                  // Get only whatsapp status === false (not yet sent)
                  { whatsappStatus: false },
                  { "customer._id": customer._id },
                ],
              },
            },
          ]);

          var smsMessage = "";
          var packageDetail = [];
          if (packages.length !== 0) {
            const { name } = packages[0].customer;
            //Header message
            smsMessage = `ສະບາຍດີ/Hi ${name} (${station})`;
            smsMessage += `\nເຮົາຂໍແຈ້ງວ່າພັດສະດຸໝາຍເລກຕໍ່ໄປນີ້ມາຮອດນແລ້ວເດີ`;
            smsMessage += "\nthe following parcel(s) has arrived now.";
            smsMessage += "\n=========================";

            let sum = 0;
            let count = 0;
            let body = "";
            packageDetail = [];

            //Body message
            packages.map(
              ({ tracking, description, shippingFee, remark, _id }) => {
                packageDetail.push({ _id, tracking, remark });

                sum += shippingFee;
                count++;
                body += `\n${count}) ${tracking}`;
                if (shippingFee) {
                  body += ` - ${shippingFee}Baht`;
                }
                if (description) {
                  body += `\n${description}`;
                }
                if (remark) {
                  body += `\nRemark: ${remark}`;
                }
                if (description || remark) {
                  body += `\n`;
                }
              }
            );
            // Footer message
            smsMessage += body;
            smsMessage += "\n=========================";
            if (sum > 0) {
              smsMessage += `\nລວມທັງໝົດ ${count} ລາຍການ: ${sum}Baht`;
              smsMessage += `\nTotal is ${count} item(s): ${sum}Baht`;
            } else {
              smsMessage += `\nລວມທັງໝົດ ${count} ລາຍການ.`;
              smsMessage += `\nTotal is ${count} item(s).`;
            }
            smsMessage += "\n\n---------------------------";
            smsMessage += `\nສິນຄ້າຂ້າງເທິງນີ້ແມ່ນຮ້ານເຮົາຮັບປະກັນໃຫ້ 3 ວັນນັບຈາກມື້ທີ່ແຈ້ງ,`;
            smsMessage += `​ກະ​ລຸ​ນາແຈ້ງ​ລາຍ​ລະ​ອຽດ​ທີ່​ຢູ່​ແລະ​ເບີ​ຕິດ​ຕໍ່​ຂອງ​ລູກຄ້າ ຖ້າຕ້ອງ​ການ​ໃຫ້​ສົ່ງ​ຕໍ່.​`;
            smsMessage += `\nYou have 3 days warranty from today for above items, please provide your address info if you want delivery.`;
            // smsMessage +=`\nຂອບໃຈທີ່ໃຊ້ບໍລິການນຳພວກເຮົາ. \nThanks for using our service.`;
            // smsMessage +=`\nWinner Express`;
          }
          // Add smsMessage to sumPackage object
          sumPackages[index].smsMessage = smsMessage;
          sumPackages[index].packageDetail = packageDetail;
        }
        res.status(200).json(sumPackages);
      } else {
        // Return status 204 if data not found
        res.status(204).json({ message: "data not found" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getSumPackagesForDelivered: async (req, res) => {
    try {
      const { station, search = "" } = req.query;
      // console.log(station);
      var sumPackages = await Package.aggregate([
        ...initialQuery,
        {
          $match: {
            $and: [
              { station: station },
              { whatsappStatus: true },
              { "customer.name": { $regex: new RegExp(search, "i") } },
            ],
          },
        },
        {
          $group: {
            _id: { customer: "$customer" },
            totalPackages: { $sum: 1 },
            totalShippingFee: { $sum: "$shippingFee" },
          },
        },
      ]);
      if (sumPackages.length !== 0) {
        // Get SMS Message for each packages
        for (let index = 0; index < sumPackages.length; index++) {
          const element = sumPackages[index];
          const customer = element._id.customer;

          const packages = await Package.aggregate([
            ...initialQuery,
            {
              $match: {
                $and: [
                  { station: station },
                  // Get only whatsapp status === false (not yet sent)
                  { whatsappStatus: true },
                  { "customer._id": customer._id },
                ],
              },
            },
          ]);

          var smsMessage = "";
          var packageDetail = [];

          if (packages.length !== 0) {
            const { name } = packages[0].customer;
            //Header message
            smsMessage = "### ຈັດສົ່ງສຳເລັດ / Delivery confirmation ###";
            smsMessage += `\nສະບາຍດີ/Hi ${name} (${station})`;
            smsMessage += `\nພັດສະດຸໝາຍເລກຕໍ່ໄປນີ້ແມ່ນລູກຄ້າໄດ້ຮັບ/ເຮົາໄດ້ສົ່ງຕໍ່ໃຫ້ລູກຄ້າແລ້ວ`;
            smsMessage +=
              "\nPlease be informed that the following parcel(s) has been delivered or forwarded to you already.";
            smsMessage += "\n=========================";

            let sum = 0;
            let count = 0;
            let body = "";
            packageDetail = [];
            //Body message
            packages.map(
              ({ tracking, description, shippingFee, remark, _id }) => {
                packageDetail.push({ _id, tracking, remark });
                sum += shippingFee;
                count++;
                body += `\n${count}) ${tracking}`;
                if (shippingFee) {
                  body += ` - ${shippingFee}Baht`;
                }
                if (description) {
                  body += `\n${description}`;
                }
                if (remark) {
                  body += `\nRemark: ${remark}`;
                }
                if (description || remark) {
                  body += `\n`;
                }
              }
            );
            // Footer message
            smsMessage += body;
            smsMessage += "\n=========================";
            if (sum > 0) {
              smsMessage += `\nລວມທັງໝົດ ${count} ລາຍການ: ${sum}Bath`;
              smsMessage += `\nTotal is ${count} item(s): ${sum}Bath`;
            } else {
              smsMessage += `\nລວມທັງໝົດ ${count} ລາຍການ.`;
              smsMessage += `\nTotal is ${count} item(s).`;
            }
          }
          smsMessage += `\n\nຖ້າມີບັນຫາໃດໆກະລຸນາແຈ້ງພວກເຮົາທັນທີ, ຂອບໃຈທີ່ໃຊ້ບໍລິການນຳພວກເຮົາ.`;
          smsMessage += `\nIf any problems please report us immediately, thanks for using our service.`;
          smsMessage += `\nWinner Express`;
          // Add smsMessage to sumPackage object
          sumPackages[index].smsMessage = smsMessage;
          sumPackages[index].packageDetail = packageDetail;
        }
        res.status(200).json(sumPackages);
      } else {
        // Return status 204 if data not found
        res.status(204).json({ message: "data not found" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  storePackage: async (req, res) => {
    try {
      // res.status(200).json({req: req.body})

      Package.create(req.body, (error, result) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
        res
          .status(200)
          .json({ status: 200, result, message: "Package has been created." });
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deletePackage: (req, res) => {
    try {
      const { id } = req.params;
      Package.deleteOne({ _id: id }, (error, result) => {
        if (error) {
          return res.status(400).json({ message: error.message });
        }
        res
          .status(200)
          .json({ result, status: 200, message: "Package has been deleted." });
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
    // console.log(req)
  },
  patchPackage: (req, res) => {
    try {
      const {
        _id,
        tracking,
        description,
        orderId,
        customerId,
        amount,
        quantity,
        shippingFee,
        routeId,
        station,
        status,
        remark,
        paymentStatus,
        whatsappStatus,
      } = req.body;

      // console.log(_id)
      Package.findByIdAndUpdate(
        { _id: _id },
        {
          $set: {
            tracking: tracking,
            description: description,
            orderId: orderId,
            amount: amount,
            customerId: customerId,
            remark: remark,
            quantity: quantity,
            shippingFee: shippingFee,
            routeId: routeId,
            station: station,
            status: status,
            paymentStatus: paymentStatus,
            whatsappStatus: whatsappStatus,
          },
        },
        (error, result) => {
          if (error) {
            return res.status(400).json({ message: error.message });
          }
          res.status(200).json({
            result,
            status: 200,
            message: `Package "${tracking}" has been updated.`,
          });
        }
      );
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
