import { useColors } from "@/components/General/(Color Manager)/useColors";
import Container from "./Container";
import Chat from "./Chat";
import { Message } from "@/utils/type";
import { useState } from "react";
import VideoTile from "./videoTile";

type Props = {
  appId: string;
  channelName: string;
  token: string;
  uid: string;
  containerUrl: string;
  isHost: boolean;
};

export default function InterviewCall(prop: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const handleSubmit = (data: Message) => {
    //TODO: handle message sending here
    setMessages([...messages, data]);
  };
  return (
    <div className="flex gap-4">
      <div className="relative w-1/2 h-screen ">
        <div className="grid grid-cols-2 gap-6 p-6">
          <VideoTile name="You" />
          <VideoTile name="Interviewer" />
        </div>
        <aside className="absolute h-[70svh] w-full bottom-0 overflow-y-auto">
          <Chat
            messages={messages}
            currentUserId={prop.uid}
            handleSubmit={(data) => handleSubmit(data)}
          />
        </aside>
      </div>
      <Container containerURL={prop.containerUrl} isHost={prop.isHost} />
    </div>
  );
}
