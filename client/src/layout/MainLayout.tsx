import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  //? useEffect to determine if the screen is mobile or not:
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <div className="h-screen flex flex-col text-gray-100 bg-black">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full flex flex-1 overflow-hidden p-2 "
      >
        <AudioPlayer />
        {/* Left Side */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className="w-2  bg-black rounded-lg transition-colors" />
        {/* Main Content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>
        {!isMobile && (
          <>
            <ResizableHandle className="w-2  bg-black rounded-lg transition-colors" />
            {/* Right Side */}
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              <RightSidebar />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      <PlayBackControls />
    </div>
  );
};

export default MainLayout;
