import { GraduationCap, TvMinimalPlay } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const authCtx = useContext(AuthContext);
  const resetCredentials = authCtx?.resetCredentials ?? (() => {});

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    router.replace("/auth/signin");
  }

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link href="/student/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="font-extrabold md:text-xl text-[14px]">
            Wisdom Driven Academy
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              if (!pathname.includes("/courses"))
                router.push("/student/courses");
            }}
            className="text-[14px] md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/student-courses")}
            className="flex items-center gap-2"
          >
            <span className="font-semibold text-[14px] md:text-[16px]">
              My Courses
            </span>
            <TvMinimalPlay className="size-5" />
          </Button>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
