import Users from "../models/users";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface IUpdateInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const createUser = (info: IUser) => {
  const user = new Users(info);
  return user.save();
};

const getUser = (email: string) => Users.findOne({ email });

const updateUser = (id: string, updateInfo: IUpdateInfo) =>
  Users.updateOne({ _id: id }, updateInfo);

const deleteUser = (id: string) => Users.deleteOne({ _id: id });

const clearTable = () => Users.deleteMany();

export default { createUser, getUser, updateUser, deleteUser, clearTable };
