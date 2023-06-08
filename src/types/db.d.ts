type User = {
  name: string;
  email: string;
  image: string;
  id: string;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
};

type Chat = {
  id: string;
  messages: Message[];
};

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
};
