import {
  createAccount,
  createTransfer,
  getAccount,
  getTransfers,
  getUser,
  updateAccount,
} from "./middleware/database";
import * as http from "http";
import User from "./classes/user";
import Account from "./classes/account";
import Transfer from "./classes/transfer";

const pathToMatchUser: string = "^/user/[a-zA-Z0-9]+$";
const pathToMatchAccount: string = "^/account/[a-zA-Z0-9]+$";
const pathToMatchTransfer: string = "^/transfers/[a-zA-Z0-9]+$";

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.match(pathToMatchUser) && req.method === "GET") {
      const user: User = await getUser(req.url.split("/user/")[1]);
      if (user) {
        res.writeHead(200);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404);
        res.end("User not found!");
      }
    }
    if (req.url.match(pathToMatchAccount) && req.method === "POST") {
      const userId: string = req.url.split("/account/")[1];
      const accountToCreate: Account = {
        customerId: userId,
        ammount: 100,
        currency: "RON",
      };
      //validate
      if (!(await getUser(userId))) {
        res.writeHead(404);
        res.end("User not found!");
        return;
      }
      await createAccount(accountToCreate);
      res.writeHead(201);
      res.end("Account created!");
    }
  } catch (error) {
    res.writeHead(500);
    res.end("Internal Server Error");
  }
  if (req.url.match(pathToMatchAccount) && req.method === "GET") {
    const account: Account = await getAccount(req.url.split("/account/")[1]);
    if (account) {
      res.writeHead(200);
      res.end(JSON.stringify(account));
    } else {
      res.writeHead(404);
      res.end("Account not found!");
    }
  }
  if (req.url.match("/transfers") && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    const transferRequest: Transfer = await new Promise((resolve) => {
      req.on("end", () => {
        resolve(JSON.parse(data));
      });
    });
    const transferToCreate: Transfer = {
      ...transferRequest,
      currency: "RON",
    };
    //validate
    if (transferRequest.fromAccountId === transferRequest.toAccountId) {
      res.writeHead(404);
      res.end("Can't transfer same account!");
      return;
    }
    const fromAccount: Account = await getAccount(
      transferRequest.fromAccountId
    );
    const toAccount: Account = await getAccount(transferRequest.toAccountId);
    if (!(fromAccount && toAccount)) {
      res.writeHead(404);
      res.end("One of the accounts not found!");
      return;
    }
    if (fromAccount.ammount >= transferRequest.ammount) {
      await Promise.all([
        createTransfer(transferToCreate),
        updateAccount(
          transferRequest.fromAccountId,
          fromAccount.ammount + transferRequest.ammount * -1
        ),
        updateAccount(
          transferRequest.toAccountId,
          toAccount.ammount + transferRequest.ammount
        ),
      ]);
      res.writeHead(201);
      res.end("Transfer done!");
    } else {
      res.writeHead(404);
      res.end("Not enough money!");
    }
  }
  if (req.url.match(pathToMatchTransfer) && req.method === "GET") {
    const accountId: string = req.url.split("/transfers/")[1];
    const transfers: Transfer[] = await getTransfers(accountId);
    if (await getAccount(accountId)) {
      res.writeHead(200);
      res.end(JSON.stringify(transfers));
    } else {
      res.writeHead(404);
      res.end("Account not found!");
    }
  }
});

const PORT: number = 8080;

server.listen(PORT);
