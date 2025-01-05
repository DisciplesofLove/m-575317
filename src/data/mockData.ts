import { User, Message, Chat } from "@/types/chat";

export const currentUser: User = {
  id: "current-user",
  name: "John Doe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  status: "online",
};

export const contacts: User[] = [
  {
    id: "1",
    name: "Sarah Parker",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: "online",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: "away",
    lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

export const initialChats: Chat[] = [
  {
    id: "1",
    participants: [currentUser, contacts[0]],
    messages: [
      {
        id: "1",
        content: "Hey! How's your project coming along?",
        sender: contacts[0],
        receiver: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "read",
        type: "text",
      },
      {
        id: "2",
        content: "Making good progress! Just implementing the chat interface now.",
        sender: currentUser,
        receiver: contacts[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
        status: "read",
        type: "text",
      },
      {
        id: "3",
        content: "That's great! Would love to see it when it's ready.",
        sender: contacts[0],
        receiver: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: "read",
        type: "text",
      },
    ],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];