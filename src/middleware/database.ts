import Transfer from "../classes/transfer";
import Account from "../classes/account";
import User from "../classes/user";
import { Datastore } from "nedb-async-await";

const db = {
  users: Datastore({
    filename: "src/middleware/user.db",
    autoload: true,
  }),
  accounts: Datastore({
    filename: "src/middleware/account.db",
    autoload: true,
  }),
  transfers: Datastore({
    filename: "src/middleware/transfer.db",
    autoload: true,
  }),
};

export const getUser = async (idUser: string): Promise<User> => {
  try {
    const userFromDB: User = await db.users.findOne(
      { _id: idUser },
      { _id: 0 }
    );
    return userFromDB;
  } catch (error) {
    throw error;
  }
};

export const createAccount = async (account: Account): Promise<void> => {
  try {
    await db.accounts.insert(account);
  } catch (error) {
    throw error;
  }
};

export const updateAccount = async (
  accountId: string,
  ammount: number
): Promise<void> => {
  try {
    await db.accounts.update({ _id: accountId }, { $set: { ammount } });
  } catch (error) {
    throw error;
  }
};

export const getAccount = async (idAccount: string): Promise<Account> => {
  try {
    const accountFromDB: Account = await db.accounts.findOne(
      { _id: idAccount },
      { _id: 0 }
    );
    return accountFromDB;
  } catch (error) {
    throw error;
  }
};

export const createTransfer = async (transfer: Transfer): Promise<void> => {
  try {
    await db.transfers.insert(transfer);
  } catch (error) {
    throw error;
  }
};

export const getTransfers = async (idTransfer: string): Promise<Transfer[]> => {
  try {
    const trasnfersFromDB: Transfer[] = await db.transfers.find(
      { $or: [{ fromAccountId: idTransfer }, { toAccountId: idTransfer }] },
      { _id: 0 }
    );
    return trasnfersFromDB;
  } catch (error) {
    throw error;
  }
};
