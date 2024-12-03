"use client";
import React, { use, useEffect, useState } from "react";
import { Page } from "@/components/dashboard/Page";
import { FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { LuMessageCircle, LuUserPlus2 } from "react-icons/lu";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import axios from "axios";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import { Input } from "@/components/ui/Input";
import { IoIosSend } from "react-icons/io";
import moment from "moment";
export default function DirectMessagePage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  const [activeMode, setActiveMode] = useState("sidebar"); // message || sidebar
  return (
    <Page className="px-2" noBackground noTitle>
      <header className="sm:flex justify-between mb-4">
        <h2 className=" text-center sm:text-left text-2xl font-semibold mb-4 sm:mb-0">
          Direct Messages
        </h2>
        <AddUserDialog
          onAdd={(user) => {
            setSelectedUser(user);
            setActiveMode("message");
          }}
        />
      </header>
      <section className="flex gap-2 min-h-[calc(100vh-300px)] sm:min-h-[calc(100vh-150px)]">
        <Sidebar
          active={activeMode == "sidebar"}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          goForward={() => setActiveMode("message")}
        />
        <Main
          active={activeMode == "message"}
          user={selectedUser}
          onBack={() => setActiveMode("sidebar")}
        />
      </section>
    </Page>
  );
}

const AddUserDialog = ({ onAdd = () => {} }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    return await axios
      .get(`/api/search-users/${searchTerm}`)
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
          return res.data.data;
        }
        setUsers([]);
        return [];
      })
      .catch((err) => {
        setUsers([]);
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchUsers();
    }
  }, [searchTerm]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>
          <LuUserPlus2 className="text-2xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-screen-md">
        <DialogTitle>Add User</DialogTitle>
        <DialogDescription></DialogDescription>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 overflow-hidden">
          <FiSearch className="text-gray-500 dark:text-gray-400" />
          <input
            className="flex-1 bg-none bg-transparent py-2 font-light focus-visible:outline-none"
            placeholder="Find by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <main className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-inner">
            <Loader2 className="w-16 h-16 animate-spin mx-auto my-20" />
          </main>
        ) : users.length > 0 ? (
          <main className="space-y-2 overflow-y-auto max-h-60 p-2 shadow-inner bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            {users.map((user, i) => {
              return (
                <div
                  key={`${user?.id}-user-list`}
                  className="flex gap-2 justify-between items-center rounded-lg p-2 hover:bg-white hover:shadow-sm dark:hover:bg-neutral-950"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        user?.profile?.profilePicture ||
                        "/default-user-icon.png"
                      }
                      height={50}
                      width={50}
                      className="rounded-full object-cover object-center h-[50px] w-[50px] overflow-hidden"
                      alt="user profile picture"
                    />

                    <div className="">
                      <h1 className="text-lg font-semibold">
                        {user?.firstName} {user?.lastName}
                      </h1>
                      <h3 className="text-xs font-light">{user?.email}</h3>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      onAdd(user);
                      setDialogOpen(false);
                    }}
                  >
                    <LuMessageCircle className="text-xl" />
                  </Button>
                </div>
              );
            })}
          </main>
        ) : (
          <main className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-inner">
            <p className="text-center text-lg font-light text-neutral-300 dark:text-gray-400 py-8">
              No User Found
            </p>
          </main>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Sidebar = ({
  selectedUser: selected,
  setSelectedUser: setSelected = () => {},
  active = true,
  goForward = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [selected, setSelected] = useState(selectedUser);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    return await axios
      .get(`/api/message/user-list`)
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.data);
          return res.data.data;
        }
        return [];
      })
      .catch((err) => {
        return [];
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   setSelected(selectedUser);
  // }, [selectedUser]);

  return (
    <aside
      className={cn(
        " bg-white dark:bg-neutral-900 rounded-lg p-4 w-full sm:min-w-60 sm:w-1/3 flex flex-col space-y-2",
        active ? "block" : "hidden sm:block"
      )}
    >
      <header>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 overflow-hidden">
          <FiSearch className="text-gray-500 dark:text-gray-400" />
          <input
            className="flex-1 bg-none bg-transparent py-2 font-light focus-visible:outline-none"
            placeholder="Search"
          />
        </div>
      </header>

      {selected && !users.some((user) => user.id === selected.id) && (
        <UserItem
          user={selected}
          selected
          onClick={() => {
            setSelected(selected);
            goForward();
          }}
        />
      )}

      {users.length > 0 ? (
        <main className="flex-1 space-y-2">
          {/* <div>users list</div> */}
          {users.map((user) => (
            <UserItem
              user={user}
              selected={selected?.id === user?.id}
              key={`sidebar-dm-user-${user?.id}`}
              onClick={() => {
                setSelected(user);
                goForward();
              }}
            />
          ))}
        </main>
      ) : (
        !selected && (
          <main className="flex-1 flex justify-center items-center">
            <p className="text-center text-lg font-light text-neutral-300 dark:text-gray-400 pb-8">
              No messages to show
            </p>
          </main>
        )
      )}
    </aside>
  );
};

const UserItem = ({ user = {}, selected = false, onClick = () => {} }) => {
  return (
    <div
      className={cn(
        "flex gap-2 justify-between items-center rounded-lg p-2  hover:shadow-sm hover:bg-violet-200 cursor-pointer dark:hover:bg-black select-none",
        selected && "bg-violet-100 dark:bg-neutral-950"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Image
          src={user?.profile?.profilePicture || "/default-user-icon.png"}
          height={50}
          width={50}
          className="rounded-full object-cover object-center min-h-[50px] min-w-[50px] overflow-hidden"
          alt="user profile picture"
        />
        <div>
          <h1 className="text-lg font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>
          <h3 className="text-xs font-light text-ellipsis">{user?.email}</h3>
        </div>
      </div>
    </div>
  );
};
const Main = ({ user, active = false, onBack = () => {} }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    return await axios
      .get(`/api/message/${user?.id}/get`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.data);
          return res.data.data;
        }

        return [];
      })
      .catch((err) => {
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sendMessage = async () => {
    return await axios
      .post(`/api/message/${user?.id}/send`, {
        content: message,
      })
      .then((res) => {
        if (res.data.success) {
          setMessages([...messages, res.data.data]);
          setMessage("");
          return res.data.data;
        }
        return null;
      })
      .catch((err) => {
        return null;
      });
  };

  useEffect(() => {
    setMessages([]);

    let intervalId;

    if (user) {
      // Fetch messages on mount
      fetchMessages();

      // Set up periodic fetching
      intervalId = setInterval(() => {
        fetchMessages();
      }, 2000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  return (
    <section
      className={cn(
        "flex-1 bg-white dark:bg-neutral-900 rounded-lg max-h-[calc(100vh-150px)]",
        !user && "hidden sm:flex justify-center items-center",
        active ? "block" : "hidden sm:block"
      )}
    >
      {!user ? (
        <article className="h-full flex items-center  justify-center">
          <p className=" font-light text-lg text-center text-neutral-300 dark:text-neutral-400">
            Select a user to start messaging
          </p>
        </article>
      ) : (
        <article className="h-full flex flex-col">
          <header className="flex items-center gap-2 border-b py-4 px-2">
            <div className="flex items-center gap-2">
              <button className="sm:hidden" onClick={onBack}>
                <MdArrowBack className="text-2xl" />
              </button>
              <Image
                src={user?.profile?.profilePicture || "/default-user-icon.png"}
                height={50}
                width={50}
                className="rounded-full object-cover object-center h-[50px] w-[50px] overflow-hidden mx-auto"
                alt="user profile picture"
              />
              <h2 className="text-2xl font-semibold">
                {`${user?.firstName} ${user?.lastName}`}{" "}
              </h2>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto py-2  flex flex-col justify-end">
            {messages.length > 0 && (
              <ul className="space-y-4 h-fit overflow-y-auto px-2">
                {messages.map((item, index) => {
                  const currentDate = moment(item?.timestamp).format(
                    "YYYY-MM-DD"
                  );
                  const previousDate =
                    index > 0
                      ? moment(messages[index - 1]?.timestamp).format(
                          "YYYY-MM-DD"
                        )
                      : null;

                  const isNewDay = currentDate !== previousDate;

                  return (
                    <div key={`message-${item?._id}`}>
                      {/* Display date if it's a new day */}
                      {isNewDay && (
                        <div className="text-center text-sm text-gray-500 mb-4">
                          {moment(item?.timestamp).format("MMMM DD, YYYY")}
                        </div>
                      )}

                      <div
                        className={cn(
                          "px-4 py-2 w-fit rounded-lg break-words",
                          item?.receiver === user?.id
                            ? "justify-self-end bg-violet-200 dark:bg-violet-500"
                            : "justify-self-start bg-neutral-100 dark:bg-neutral-800"
                        )}
                      >
                        {item?.content}
                      </div>
                      <p
                        className={cn(
                          "text-[12px] dark:text-neutral-500 font-light",
                          item?.receiver === user?.id
                            ? "text-right"
                            : "text-left"
                        )}
                      >
                        {moment(item?.timestamp).format("hh:mm:A")}
                      </p>
                    </div>
                  );
                })}
              </ul>
            )}
          </main>
          <footer className="py-2 px-2">
            <div className="flex gap-2">
              <Input
                className="dark:bg-neutral-800"
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (message.trim().length > 0) {
                      sendMessage();
                    }
                  }
                }}
              />
              <Button
                className="py-6 text-2xl"
                onClick={sendMessage}
                disabled={message.trim().length == 0}
              >
                <IoIosSend />
              </Button>
            </div>
          </footer>
        </article>
      )}
    </section>
  );
};
