import Admin from "../model/auth.js";
import avatarUpload from "../middle/uploadAvatar.js";
import multer from "multer";

export const saveAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file.filename;

    const admin = new Admin({
      name,
      email,
      password,
      avatar,
    });

    const savedAdmin = await admin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res
        .status(404)
        .json({ message: "Admin not found or already deleted" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error during admin deletion" });
  }
};

export const updateAdminPassword = async (req, res) => {
  const adminId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await admin.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    admin.password = newPassword;

    const updatedAdmin = await admin.save();

    res.json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error during admin update", error: error.message });
  }
};

export const updateAdminInfo = async (req, res) => {
  try {
    const { name } = req.body;
    const updateFields = {
      name,
    };

    if (req.file) {
      updateFields.avatar = req.file.filename;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Erreur interne du serveur lors de la mise à jour du admin",
        error: error.message,
      });
  }
};
