const Account = require("../models/Account.js");
const Customer = require("../models/Customer");

module.exports = {
  getAccount: async (req, res) => {
    try {
      const { id, customerId } = req.body;
      const account = await Account.findOne({ $or: [{ id }, { customerId }] });
      if (account === null) {
        res.status(202).json({ message: "data not found!" });
      } else {
        res.status(200).json(account);
      }
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  getAccounts: async (req, res) => {
    try {
      const accounts = await Account.find({});
      res.status(200).json(accounts);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  storeAccount: async (req, res) => {
    try {
      const { customerId } = req.body;
      const countCustomerId = Customer.countDocuments({
        id: customerId,
      });
      if (countCustomerId === 0)
        return res.status(400).json({ message: "CustomerId not found" });

      const count = await Account.countDocuments({});
      let newId = "AC" + Number(count).toString().padStart(8, "0");
      req.body.id = newId;

      await Account.create(req.body, (error, account) => {
        if (error) {
          if(error.code === 11000) return res.status(400).json({message: 'duplicate value, please check customerId or name'})
          return res.status(400).json({ message: error });
        }

        res.status(201).json({
          status: 201,
          account,
          message: "New account has been created.",
        });
      });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  patchAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const account = await Account.findOne({ id });
      if (account === null) {
        return res.status(202).json({ message: "data not found!" });
      }
      const { THB, LAK, USD, profileImage } = req.body;
      Account.findOneAndUpdate(
        { id },
        { $set: { THB, LAK, USD, profileImage } },
        (error, result) => {
          if (error) return res.status(400).json({ message: error.message });
          res
            .status(200)
            .json({ result, message: `Account ID: ${id} has been updated.` });
        }
      );
    } catch (error) {
      res.status(400).json({ message: error });
    }
  },
  softDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const account = await Account.findOne({ id });
      if (account === null) {
        return res.status(202).json({ message: "data not found!" });
      }
      Account.findOneAndUpdate(
        { id },
        { $set: { validflag: false } },
        (error, result) => {
          if (error) return res.status(400).json({ message: error.message });
          res
            .status(200)
            .json({ result, message: `Account ID: ${id} has been deleted.` });
        }
      );
    } catch (error) {
      res.status(409).json({ message: error });
    }
  },
  reactivate: async (req, res) => {
    try {
      const { id } = req.params;
      const account = await Account.findOne({ id });
      if (account === null) {
        return res.status(202).json({ message: "data not found!" });
      }
      Account.findOneAndUpdate(
        { id },
        { $set: { validflag: true } },
        (error, result) => {
          if (error) return res.status(400).json({ message: error.message });
          res.status(200).json({
            result,
            message: `Account ID: ${id} has been re-activated.`,
          });
        }
      );
    } catch (error) {
      res.status(409).json({ message: error });
    }
  },
};
