const cron = require("node-cron");

cron.schedule("0 */10 * * * *", async () => {
  //* */10 * * * *
  await addLeave();
});

const addLeave = async () => {
  const User = require("../model/user");
  await User.updateMany(
    { userType: "employ" },
    { $inc: { availableLeaves: 3 } }
  ).then(() => {
    console.log("3 new added");
  });
};
