import User from "../../models/user";
import { ObjectId } from "mongodb";

export interface ValidateUserProps {
  _id?: string;
  username: string;
  email: string;
}

export default async ({ _id, username, email }: ValidateUserProps) => {
  const includingId: Record<string, any> = {};
  if (_id && !["undefined", "null"].includes(String(_id))) {
    includingId._id = { $ne: new ObjectId(_id as string) };
  }
  let users;
  if (username && email) {
    users = await User.find({
      ...includingId,
      $or: [{ email }, { username }],
    }).collation({
      locale: "en",
      strength: 2,
    });
    let isEmailDuplicated = false;
    let isUsernameDuplicated = false;
    users?.forEach((user) => {
      if (user.email === email) {
        isEmailDuplicated = true;
      }
      if (user.username === username) {
        isUsernameDuplicated = true;
      }
    });
    let errorMessage: string = "";
    errorMessage = isEmailDuplicated ? "Email is already taken" : errorMessage;
    errorMessage = isUsernameDuplicated
      ? "Username is already taken"
      : errorMessage;
    errorMessage =
      isUsernameDuplicated && isEmailDuplicated
        ? "Both email and username are already taken"
        : errorMessage;
    return errorMessage;
  }
  if (username) {
    users = await User.find({ ...includingId, username }).collation({
      locale: "en",
      strength: 2,
    });
  }
  if (email) {
    users = await User.find({ ...includingId, email }).collation({
      locale: "en",
      strength: 2,
    });
  }
  return users;
};
