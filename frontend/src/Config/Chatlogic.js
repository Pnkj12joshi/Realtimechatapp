export const isSameSender = (messages, m, i, userId) => {
  //console.log();
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
export const isLastMessages = (messages, i, userId) => {
  console.log(i);
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
export const getSender = (loggeduser, user) => {
  console.log(loggeduser,user);
  console.log(user[0].name);
  return user[0]._id === loggeduser._id ? user[1].name : user[0].name;
};
export const getSenderFull = (loggeduser, user) => {
  return user[0]._id === loggeduser._id ? user[1] : user[0];
};
