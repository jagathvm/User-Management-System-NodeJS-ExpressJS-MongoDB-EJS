import { ObjectId } from "mongodb";
import { getUsersCollection } from "../config/db.js";
import {
  formatDateToISOString,
  hashedPassword,
} from "../helpers/userHelpers.js";

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
      $or: [{ username }, { email }, { tel: parseInt(tel) }],
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findUsersByFilter = async (
  filter = {},
  sort = {},
  page = 1,
  limit = 5
) => {
  try {
    const users = await getUsersCollection
      .find(filter)
      .sort(sort)
      .skip(limit * page - limit)
      .limit(limit)
      .toArray();

    return users;
  } catch (error) {
    console.error(`Error in findUsersByFilter: ${error}`);
    throw error;
  }
};

export const findUsersCount = async (filter = {}) => {
  try {
    const usersCount = await getUsersCollection.countDocuments(filter);
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
        createdAt: formatDateToISOString(new Date()),
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

export const blockOrUnblockUser = async (username, isBlocked) => {
  try {
    // Unblock User
    if (isBlocked === true) {
      const { modifiedCount } = await updateUserData(username, {
        "accountStatus.isBlocked": false,
      });

      if (!modifiedCount)
        return { success: false, message: "Error Unblocking User" };

      return {
        success: true,
        message: "User Unblocked",
      };
    }

    // Block User
    const { modifiedCount } = await updateUserData(username, {
      "accountStatus.isBlocked": true,
    });

    if (!modifiedCount)
      return { success: false, message: "Error Blocking User" };

    return {
      success: true,
      message: "User Blocked",
    };
  } catch (error) {
    console.error(error);
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
