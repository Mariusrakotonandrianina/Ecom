import User from "../model/user.js";

export const getAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find();
    res.status(200).json({ getAllUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const saveUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file.filename;

    const newUser = new User({
      name,
      avatar,
      email,
      password,
    });
    
    const saveUser = await newUser.save();
    res.status(200).json({ saveUser });
    console.log(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const updateFields = {
      name,
    };

    if (req.file) {
      updateFields.avatar = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
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

export const updateUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    user.password = newPassword;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error during password update", error: error.message });
  }
};
