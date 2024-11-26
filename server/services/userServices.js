import { ObjectId } from "mongodb";
import { getUsersCollection } from "../config/db.js";
import { formatDate, hashedPassword } from "../helpers/userHelpers.js";

export const findUserById = async (id) => {
  try {
    const user = await getUsersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await getUsersCollection.findOne({ email });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByUsername = async (username) => {
  try {
    const user = await getUsersCollection.findOne({ username });
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUserByCredentials = async (username, email, tel) => {
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

export const findUsersBySearchCriteria = async (searchCriteria) => {
  try {
    const users = await getUsersCollection
      .find({
        $or: [
          { username: searchCriteria },
          { email: searchCriteria },
          { tel: searchCriteria },
        ],
      })
      .toArray();

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUsersByFilter = async (page, perPage) => {
  try {
    const users = await getUsersCollection
      .find()
      .sort({ firstName: 1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .toArray();

    return users;
  } catch (error) {
    console.error(`Error in findUsersByFilter: ${error}`);
    throw error;
  }
};

export const findUsersCount = async () => {
  try {
    const usersCount = await getUsersCollection.countDocuments();
    return usersCount;
  } catch (error) {
    console.error(`Error in findUsersCount: ${error}`);
    throw error;
  }
};

export const createUser = async (data) => {
  const { username, tel, email, password } = data;

  try {
    const passwordHash = await hashedPassword(password);
    const userData = {
      username,
      tel: Number(tel),
      email,
      password: passwordHash,
      role: data.role || {
        id: 2,
        name: "USER",
      },
      accountStatus: data.accountStatus || {
        status: "ACTIVE",
        createdAt: formatDate(new Date()),
        lastLogin: null,
        lastUpdated: null,
      },
    };

    const result = await getUsersCollection.insertOne(userData);
    if (!result) return null;

    return result;
  } catch (error) {
    console.error("Error in creating user:", error);
    throw error;
  }
};

export const updateUserData = async (username, data) => {
  try {
    const result = await getUsersCollection.updateOne(
      { username },
      {
        $set: {
          ...data,
        },
      }
    );
    return result;
  } catch (error) {
    console.error("Error in updating user:", error);
    throw error;
  }
};

export const deleteUserData = async (username) => {
  try {
    const result = await getUsersCollection.deleteOne({ username });
    return result;
  } catch (error) {
    console.error("Error in deleting user:", error);
    throw error;
  }
};
