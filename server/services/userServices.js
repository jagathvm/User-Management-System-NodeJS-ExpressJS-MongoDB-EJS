import { ObjectId } from "mongodb";
import { getUsersCollection } from "../config/db.js";
import { hashedPassword, setCookies } from "../helpers/authHelpers.js";

const findUserById = async (id) => {
  try {
    const user = await getUsersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await getUsersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserByCredentials = async (username, email, tel) => {
  try {
    const user = await getUsersCollection.findOne({
      $or: [{ username }, { email }, { tel }],
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createUser = async (res, data) => {
  const { username, tel, email, password } = data;

  try {
    const passwordHash = await hashedPassword(password);
    const userData = {
      username,
      tel,
      email,
      password: passwordHash,
      role: {
        id: 2,
        name: "USER",
      },
    };

    const { acknowledged, insertedId } = await getUsersCollection.insertOne(
      userData
    );
    if (!acknowledged) return null;

    const user = await findUserById(insertedId);
    if (!user) return null;

    await setCookies(res, user);

    return user;
  } catch (error) {
    console.error("Error in creating user:", error);
    throw error;
  }
};

export { findUserByEmail, findUserByCredentials, createUser };
