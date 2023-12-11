import User from "../model/user.js";

export const getAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find();
    res.status(200).json({ getAllUser });
  } catch (error) {
    res.status(500).send(error);
  }
};

// create user
export const saveUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    const newUser = new User({
      name,
      avatar,
      email,
      password,
    });
    //ajout image
    if (req.file) {
      newUser.avatar = req.file.path;
    } else {
      console.log(error);
    }
    const saveUser = await newUser.save();
    res.status(200).json({ saveUser });
    console.log(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    //update image
    if (req.file) {
      user.avatar = req.file.path;
    } else {
      console.log(error);
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).send(error);
  }
};
