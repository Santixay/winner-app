import Role from "../models/Role.js";

export const getRoleList = async (req, res) => {
  try {
    const roles = await Role.find();
    if (roles) {
      res.status(200).json(roles);
    } else {
      res.status(204).json({ message: "data not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRoleDetail = async (req, res) => {
  try {
    const { id } = req.query;
    const role = await Role.findOne({ id: id });
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(204).json({ message: "data not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const storeRole = async (req, res) => {
  try {
    let { role, description, permission, remark } = req.body;
    const response = Role.create(
      {
        role,
        description,
        permission,
        remark,
        validflag: true,
      },
      (error) => {
        if (error) {
          res.status(400).json({ message: error.message });
          return;
        }
        res.status(200).json({
          status: 200,
          message: "Role has been created.",
          role: response,
        });
      }
    );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    Role.deleteOne({ _id: id }, (error, user) => {
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(200).json({ user, message: "User has been deleted." });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const patchRole = async (req, res) => {
  try {
    const { _id, role, description, permission, remark, validflag } = req.body;
    Role.updateOne(
      { _id: _id },
      {
        $set: {
          role: role,
          description: description,
          permission: permission,
          remark: remark,
          validflag: validflag,
        },
      },
      (error, role) => {
        if (error) {
          res.status(400).json({ message: error.message });
          return;
        }
        res
          .status(200)
          .json({ status: 200, role, message: "User has been updated." });
      }
    );
  } catch (error) {
    res.status(404).json({ message: "No user found", error });
  }
};
